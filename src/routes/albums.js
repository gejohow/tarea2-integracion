const KoaRouter = require('koa-router');
const btoa = require('btoa');

const router = new KoaRouter();

router.get('albums.all', '/', async (ctx) => {
  let albums = await ctx.orm.album.findAll();
  albums = JSON.parse(JSON.stringify(albums).split('"albumId":').join('"id":'));
  albums = JSON.parse(JSON.stringify(albums).split('"artistId":').join('"artist_id":'));
  albums = JSON.parse(JSON.stringify(albums).split('"artist_url":').join('"artist":'));
  albums = JSON.parse(JSON.stringify(albums).split('"tracks_url":').join('"tracks":'));
  albums = JSON.parse(JSON.stringify(albums).split('"self_url":').join('"self":'));
  // eslint-disable-next-line no-param-reassign
  albums.forEach((v) => { delete v.createdAt; });
  // eslint-disable-next-line no-param-reassign
  albums.forEach((v) => { delete v.updatedAt; });
  ctx.body = albums;
  ctx.status = 200;
});

router.get('albums.find', '/:albumId', async (ctx) => {
  let album = await ctx.orm.album.findByPk(ctx.params.albumId);
  if (album) {
    album = JSON.parse(JSON.stringify(album).split('"albumId":').join('"id":'));
    album = JSON.parse(JSON.stringify(album).split('"artist_url":').join('"artist":'));
    album = JSON.parse(JSON.stringify(album).split('"artistId":').join('"artist_id":'));
    album = JSON.parse(JSON.stringify(album).split('"tracks_url":').join('"tracks":'));
    album = JSON.parse(JSON.stringify(album).split('"self_url":').join('"self":'));
    // eslint-disable-next-line no-param-reassign
    delete album.createdAt;
    // eslint-disable-next-line no-param-reassign
    delete album.updatedAt;
    ctx.body = album;
    ctx.status = 200;
  } else {
    ctx.status = 404;
  }
});

router.get('albums.tracks', '/:albumId/tracks', async (ctx) => {
  const album = await ctx.orm.album.findByPk(ctx.params.albumId);
  if (album) {
    let tracks = await album.getTracks();
    tracks = JSON.parse(JSON.stringify(tracks).split('"trackId":').join('"id":'));
    tracks = JSON.parse(JSON.stringify(tracks).split('"albumId":').join('"album_id":'));
    tracks = JSON.parse(JSON.stringify(tracks).split('"artist_url":').join('"artist":'));
    tracks = JSON.parse(JSON.stringify(tracks).split('"album_url":').join('"album":'));
    tracks = JSON.parse(JSON.stringify(tracks).split('"self_url":').join('"self":'));
    // eslint-disable-next-line no-param-reassign
    tracks.forEach((v) => { delete v.createdAt; });
    // eslint-disable-next-line no-param-reassign
    tracks.forEach((v) => { delete v.updatedAt; });
    ctx.body = tracks;
    ctx.status = 200;
  } else {
    ctx.status = 404;
  }
});

router.put('albums.tracks.play', '/:albumId/tracks/play', async (ctx) => {
  const album = await ctx.orm.album.findByPk(ctx.params.albumId);
  if (album) {
    const tracks = await album.getTracks();
    await tracks.forEach((track) => {
      const times = track.times_played;
      const NewTimesPlayed = times + 1;
      track.update({ times_played: NewTimesPlayed });
    });
    ctx.status = 200;
  } else {
    ctx.status = 404;
  }
});

router.post('tracks.create', '/:albumId/tracks', async (ctx) => {
  const { name, duration } = ctx.request.body;
  const album = await ctx.orm.album.findByPk(ctx.params.albumId);
  if ((!duration) || (!name)) {
    ctx.status = 400;
  } else if ((typeof name === 'string' || name instanceof String) && !(typeof duration === 'string' || duration instanceof String)) {
    if (album) {
      const albumid = album.albumId;
      let encode = name;
      encode += `:${albumid}`;
      const result = btoa(encode);
      const id = result.slice(0, 22);
      const exists = await ctx.orm.track.findByPk(id);
      if (!exists) {
        const artisturl = `${album.artist_url}`;
        const albumurl = `${album.self_url}`;
        const selfurl = `${ctx.origin}/tracks/${id}`;
        album.createTrack(
          {
            trackId: id,
            albumId: album.albumId,
            name,
            duration,
            times_played: 0,
            artist_url: artisturl,
            album_url: albumurl,
            self_url: selfurl,
          },
        );
        ctx.status = 201;
        ctx.body = {
          id,
          album_id: albumid,
          name,
          duration,
          times_played: 0,
          artist: artisturl,
          album: albumurl,
          self: selfurl,
        };
      } else {
        ctx.status = 409;
        ctx.body = {
          id: exists.trackId,
          album_id: exists.album_id,
          name: exists.name,
          duration: exists.duration,
          times_played: exists.times_played,
          artist: exists.artist_url,
          album: exists.album_url,
          self: exists.self_url,
        };
      }
    } else {
      ctx.status = 422;
    }
  } else {
    ctx.status = 400;
  }
});

router.del('album.delete', '/:albumId', async (ctx) => {
  const album = await ctx.orm.album.findByPk(ctx.params.albumId);
  if (album) {
    await album.destroy();
    ctx.status = 204;
  } else {
    ctx.status = 404;
  }
});

module.exports = router;
