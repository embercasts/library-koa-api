import Router from 'koa-router';
import Sequelize from 'sequelize';
import currentUser from '../middleware/current-user';
import ForbiddenError from '../errors/forbidden';

const router = new Router();
const includeUser = { include: ['User'] };

router.get('/', async (ctx) => {
  const query = ctx.query['filter[query]'];
  let books;

  if (query) {
    books = await ctx.app.db.Book.findAll({
      where: {
        [Sequelize.Op.or]: [
          { title: { [Sequelize.Op.iLike]: `%${query}%` } },
          { isbn: { [Sequelize.Op.iLike]: `%${query}%` } },
        ]
      },
      ...includeUser
    });
  } else {
    books = await ctx.app.db.Book.findAll(includeUser);
  }

  ctx.body = ctx.app.serialize('book', books);
});

router.get('/:id', async (ctx) => {
  const id = ctx.params.id;
  const book = await ctx.app.db.Book.findOrFail(id, includeUser);

  ctx.body = ctx.app.serialize('book', book);
});

router.get('/:id/author', async (ctx) => {
  const id = ctx.params.id;
  const book = await ctx.app.db.Book.findOrFail(id);

  const author = await book.getAuthor(includeUser);

  ctx.body = ctx.app.serialize('author', author);
});

router.get('/:id/reviews', async (ctx) => {
  const id = ctx.params.id;
  const book = await ctx.app.db.Book.findOrFail(id);

  const reviews = await book.getReviews(includeUser);

  ctx.body = ctx.app.serialize('review', reviews);
});

router.post('/', currentUser, async (ctx) => {
  const attrs = ctx.getAttributes();
  attrs.UserId = ctx.currentUser.id;

  const book = await ctx.app.db.Book.create(attrs);
  book.User = ctx.currentUser;

  ctx.body = ctx.app.serialize('book', book);
});

router.patch('/:id', currentUser, async (ctx) => {
  const attrs = ctx.getAttributes();

  const id = ctx.params.id;
  const book = await ctx.app.db.Book.findOrFail(id, includeUser);

  if (ctx.currentUser.id !== book.UserId) {
    throw new ForbiddenError();
  }

  book.set(attrs);
  await book.save();

  ctx.body = ctx.app.serialize('book', book);
});

router.del('/:id', currentUser, async (ctx) => {
  const id = ctx.params.id;
  const book = await ctx.app.db.Book.findOrFail(id);

  if (ctx.currentUser.id !== book.UserId) {
    throw new ForbiddenError();
  }

  await book.destroy();

  ctx.status = 204;
  ctx.body = null;
});

export default router.routes();
