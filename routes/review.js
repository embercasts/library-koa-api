import Router from 'koa-router';
import Sequelize from 'sequelize';

const router = new Router();

router.get('/', async (ctx) => {
  let review = await ctx.app.db.Review.findAll();

  ctx.body = ctx.app.serialize('review', review);
});

router.get('/:id', async (ctx) => {
  const id = ctx.params.id;
  const review = await ctx.app.db.Review.findOrFail(id);

  ctx.body = ctx.app.serialize('review', review);
});

router.get('/:id/book', async (ctx) => {
  const id = ctx.params.id;
  const review = await ctx.app.db.Review.findOrFail(id);

  const book = await review.getBook();

  ctx.body = ctx.app.serialize('book', book);
});

router.post('/', async (ctx) => {
  const attrs = ctx.getAttributes();

  const review = await ctx.app.db.Review.create(attrs);

  ctx.body = ctx.app.serialize('review', review);
});

router.patch('/:id', async (ctx) => {
  const attrs = ctx.getAttributes();

  const id = ctx.params.id;
  const review = await ctx.app.db.Review.findOrFail(id);

  review.set(attrs);
  await review.save();

  ctx.body = ctx.app.serialize('review', review);
});

router.del('/:id', async (ctx) => {
  const id = ctx.params.id;
  const review = await ctx.app.db.Review.findOrFail(id);
  await review.destroy();

  ctx.status = 204;
  ctx.body = null;
});

export default router.routes();
