import Router from 'koa-router';
import Sequelize from 'sequelize';
import currentUser from '../middleware/current-user';

const router = new Router();

const includeUser = { include: ['User'] };

router.get('/', async (ctx) => {
  let review = await ctx.app.db.Review.findAll(includeUser);

  ctx.body = ctx.app.serialize('review', review);
});

router.get('/:id', async (ctx) => {
  const id = ctx.params.id;
  const review = await ctx.app.db.Review.findOrFail(id, includeUser);

  ctx.body = ctx.app.serialize('review', review);
});

router.get('/:id/book', async (ctx) => {
  const id = ctx.params.id;
  const review = await ctx.app.db.Review.findOrFail(id);

  const book = await review.getBook(includeUser);

  ctx.body = ctx.app.serialize('book', book);
});

router.post('/', currentUser, async (ctx) => {
  const attrs = ctx.getAttributes();
  attrs.UserId = ctx.currentUser.id;

  const review = await ctx.app.db.Review.create(attrs);
  review.User = ctx.currentUser;

  ctx.body = ctx.app.serialize('review', review);
});

router.patch('/:id', async (ctx) => {
  const attrs = ctx.getAttributes();

  const id = ctx.params.id;
  const review = await ctx.app.db.Review.findOrFail(id, includeUser);

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
