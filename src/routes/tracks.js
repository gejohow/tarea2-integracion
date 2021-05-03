const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('tracks.all', '/', async (ctx) => {
  let tracks = await ctx.orm.track.findAll();
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
});

router.get('tracks.find', '/:trackId', async (ctx) => {
  let track = await ctx.orm.track.findByPk(ctx.params.trackId);
  if (track) {
    track = JSON.parse(JSON.stringify(track).split('"trackId":').join('"id":'));
    track = JSON.parse(JSON.stringify(track).split('"albumId":').join('"album_id":'));
    track = JSON.parse(JSON.stringify(track).split('"artist_url":').join('"artist":'));
    track = JSON.parse(JSON.stringify(track).split('"tracks_url":').join('"tracks":'));
    track = JSON.parse(JSON.stringify(track).split('"self_url":').join('"self":'));
    // eslint-disable-next-line no-param-reassign
    delete track.createdAt;
    // eslint-disable-next-line no-param-reassign
    delete track.updatedAt;
    ctx.body = track;
    ctx.status = 200;
  } else {
    ctx.status = 404;
  }
});

router.put('track.play', '/:trackId/play', async (ctx) => {
  const track = await ctx.orm.track.findByPk(ctx.params.trackId);
  if (track) {
    const times = track.times_played;
    const NewTimesPlayed = times + 1;
    track.update({ times_played: NewTimesPlayed });
    ctx.status = 200;
  } else {
    ctx.status = 404;
  }
});

router.del('track.delete', '/:trackId', async (ctx) => {
  const track = await ctx.orm.track.findByPk(ctx.params.trackId);
  if (track) {
    await track.destroy();
    ctx.status = 204;
  } else {
    ctx.status = 404;
  }
});

module.exports = router;
