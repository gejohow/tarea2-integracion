const KoaRouter = require('koa-router');

const hello = require('./routes/hello');
const index = require('./routes/index');
const artists = require('./routes/artists');
const albums = require('./routes/albums');
const tracks = require('./routes/tracks');

const router = new KoaRouter();

router.use('/', index.routes());
router.use('/hello', hello.routes());
router.use('/artists', artists.routes());
router.use('/albums', albums.routes());
router.use('/tracks', tracks.routes());

module.exports = router;
