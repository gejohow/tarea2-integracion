const KoaRouter = require('koa-router');
const btoa = require('btoa');

const router = new KoaRouter();

const flatten = (arr) => arr.reduce(
  (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), [],
);

router.get('artists.all', '/', async (ctx) => {
  let artists = await ctx.orm.artist.findAll();
  artists = JSON.parse(JSON.stringify(artists).split('"artistId":').join('"id":'));
  artists = JSON.parse(JSON.stringify(artists).split('"albums_url":').join('"albums":'));
  artists = JSON.parse(JSON.stringify(artists).split('"tracks_url":').join('"tracks":'));
  artists = JSON.parse(JSON.stringify(artists).split('"self_url":').join('"self":'));
  // eslint-disable-next-line no-param-reassign
  artists.forEach((v) => { delete v.createdAt; });
  // eslint-disable-next-line no-param-reassign
  artists.forEach((v) => { delete v.updatedAt; });
  ctx.status = 200;
  ctx.body = artists;
});

router.get('artists.find', '/:artistId', async (ctx) => {
  let artist = await ctx.orm.artist.findByPk(ctx.params.artistId);
  if (artist) {
    artist = JSON.parse(JSON.stringify(artist).split('"artistId":').join('"id":'));
    artist = JSON.parse(JSON.stringify(artist).split('"albums_url":').join('"albums":'));
    artist = JSON.parse(JSON.stringify(artist).split('"tracks_url":').join('"tracks":'));
    artist = JSON.parse(JSON.stringify(artist).split('"self_url":').join('"self":'));
    // eslint-disable-next-line no-param-reassign
    delete artist.createdAt;
    // eslint-disable-next-line no-param-reassign
    delete artist.updatedAt;
    ctx.body = artist;
    ctx.status = 200;
  } else {
    ctx.status = 404;
  }
});

router.get('artists.albums', '/:artistId/albums', async (ctx) => {
  const artist = await ctx.orm.artist.findByPk(ctx.params.artistId);
  if (artist) {
    let albums = await artist.getAlbums();
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
  } else {
    ctx.status = 404;
  }
});

router.get('artists.tracks', '/:artistId/tracks', async (ctx) => {
  const artist = await ctx.orm.artist.findByPk(ctx.params.artistId);
  if (artist) {
    const albums = await artist.getAlbums({ include: ctx.orm.track });
    const arr2 = [];
    albums.forEach((element) => {
      arr2.push(element.tracks);
    });
    let result = await flatten(arr2);

    result = JSON.parse(JSON.stringify(result).split('"trackId":').join('"id":'));
    result = JSON.parse(JSON.stringify(result).split('"albumId":').join('"album_id":'));
    result = JSON.parse(JSON.stringify(result).split('"artist_url":').join('"artist":'));
    result = JSON.parse(JSON.stringify(result).split('"album_url":').join('"album":'));
    result = JSON.parse(JSON.stringify(result).split('"self_url":').join('"self":'));
    // eslint-disable-next-line no-param-reassign
    result.forEach((v) => { delete v.createdAt; });
    // eslint-disable-next-line no-param-reassign
    result.forEach((v) => { delete v.updatedAt; });

    ctx.body = result;
    ctx.status = 200;
  } else {
    ctx.status = 404;
  }
});

router.put('artists.tracks.play', '/:artistId/albums/play', async (ctx) => {
  const artist = await ctx.orm.artist.findByPk(ctx.params.artistId);
  if (artist) {
    const albums = await artist.getAlbums({ include: ctx.orm.track });
    await albums.forEach((element) => {
      // eslint-disable-next-line prefer-destructuring
      const tracks = element.tracks;
      tracks.forEach((track) => {
        const times = track.times_played;
        const NewTimesPlayed = times + 1;
        track.update({ times_played: NewTimesPlayed });
      });
    });
    ctx.status = 200;
  } else {
    ctx.status = 404;
  }
});

router.post('artists.create', '/', async (ctx) => {
  const { name, age } = ctx.request.body;
  if ((typeof name === 'string' || name instanceof String) && Number.isInteger(age)) {
    const encode = btoa(name);
    const id = encode.slice(0, 22);
    const exists = await ctx.orm.artist.findByPk(id);
    if (!exists) {
      const albums = `${ctx.origin}/artists/${id}/albums`;
      const tracks = `${ctx.origin}/artists/${id}/tracks`;
      const selfurl = `${ctx.origin}/artists/${id}`;
      const artist = ctx.orm.artist.build();
      artist.artistId = id;
      artist.name = name;
      artist.age = age;
      artist.albums_url = albums;
      artist.tracks_url = tracks;
      artist.self_url = selfurl;
      await artist.save();
      ctx.status = 201;
      ctx.body = {
        id: artist.artistId,
        name: artist.name,
        age: artist.age,
        albums: artist.albums_url,
        tracks: artist.tracks_url,
        self: selfurl,
      };
    } else {
      ctx.status = 409;
      ctx.body = {
        id: exists.artistId,
        name: exists.name,
        age: exists.age,
        albums: exists.albums_url,
        tracks: exists.tracks_url,
        self: exists.self_url,
      };
    }
  } else {
    ctx.status = 400;
  }
});

router.post('albums.create', '/:artistId/albums', async (ctx) => {
  const { name, genre } = ctx.request.body;
  const artist = await ctx.orm.artist.findByPk(ctx.params.artistId);
  if ((typeof name === 'string' || name instanceof String) && (typeof genre === 'string' || genre instanceof String)) {
    if (artist) {
      const artistid = artist.artistId;
      let encode = name;
      encode += `:${artistid}`;
      const result = btoa(encode);
      const id = result.slice(0, 22);
      const exists = await ctx.orm.album.findByPk(id);
      if (!exists) {
        const artisturl = `${artist.self_url}`;
        const tracksurl = `${ctx.origin}/albums/${id}/tracks`;
        const selfurl = `${ctx.origin}/albums/${id}`;
        artist.createAlbum(
          {
            albumId: id,
            artistId: artistid,
            name,
            genre,
            artist_url: artisturl,
            tracks_url: tracksurl,
            self_url: selfurl,
          },
        );
        ctx.status = 201;
        ctx.body = {
          id,
          artist_id: artistid,
          name,
          genre,
          artist: artisturl,
          tracks: tracksurl,
          self: selfurl,
        };
      } else {
        ctx.status = 409;
        ctx.body = {
          id: exists.albumId,
          name: exists.name,
          genre: exists.genre,
          albums: exists.artist_url,
          tracks: exists.tracks_url,
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

router.del('artist.delete', '/:artistId', async (ctx) => {
  const artist = await ctx.orm.artist.findByPk(ctx.params.artistId);
  if (artist) {
    await artist.destroy();
    ctx.status = 204;
  } else {
    ctx.status = 404;
  }
});

module.exports = router;
