import Router from 'koa-router';
import Sequelize from 'sequelize';
import currentUser from '../middleware/current-user';
import ForbiddenError from '../errors/forbidden';

const router = new Router();
const includeUser = { include: ['User'] };

router.get('/', async (ctx) => {
  const query = ctx.query['filter[query]'];
  let authors;

  if (query) {
    authors = await ctx.app.db.Author.findAll({
      where: {
        [Sequelize.Op.or]: [
          { first: { [Sequelize.Op.iLike]: `%${query}%` } },
          { last: { [Sequelize.Op.iLike]: `%${query}%` } },
        ]
      },
      ...includeUser
    });
  } else {
    authors = await ctx.app.db.Author.findAll(includeUser);
  }

  ctx.body = ctx.app.serialize('author', authors);
});

router.get('/:id', async (ctx) => {
  const id = ctx.params.id;
  const author = await ctx.app.db.Author.findOrFail(id, includeUser);

  ctx.body = ctx.app.serialize('author', author);
});

router.get('/:id/books', async (ctx) => {
  const id = ctx.params.id;
  const author = await ctx.app.db.Author.findOrFail(id);
  const books = await author.getBooks(includeUser);

  ctx.body = ctx.app.serialize('book', books);
});

router.post('/', currentUser, async (ctx) => {
  const attrs = ctx.getAttributes();
  attrs.UserId = ctx.currentUser.id;
  const author = await ctx.app.db.Author.create(attrs);
  author.User = ctx.currentUser;

  ctx.status = 201;
  ctx.set('Location', `/authors/${author.id}`);
  ctx.body = ctx.app.serialize('author', author);
});

router.patch('/:id', currentUser, async (ctx) => {
  const attrs = ctx.getAttributes();
  const id = ctx.params.id;
  const author = await ctx.app.db.Author.findOrFail(id, includeUser);

  if (ctx.currentUser.id !== author.UserId) {
    throw new ForbiddenError();
  }

  author.set(attrs);
  await author.save();

  ctx.body = ctx.app.serialize('author', author);
});

router.del('/:id', currentUser, async (ctx) => {
  const id = ctx.params.id;
  const author = await ctx.app.db.Author.findOrFail(id);

  if (ctx.currentUser.id !== author.UserId) {
    throw new ForbiddenError();
  }

  await author.destroy();

  ctx.status = 204;
  ctx.body = null;
});

export default router.routes();















