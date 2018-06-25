import Router from 'koa-router';
import Sequelize from 'sequelize';

const router = new Router();

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
      }
    });
  } else {
    books = await ctx.app.db.Book.findAll();
  }

  ctx.body = ctx.app.serialize('book', books);
});

router.get('/:id', async (ctx) => {
  const id = ctx.params.id;
  const book = await ctx.app.db.Book.findOrFail(id);

  ctx.body = ctx.app.serialize('book', book);
});

router.get('/:id/author', async (ctx) => {
  const id = ctx.params.id;
  const book = await ctx.app.db.Book.findOrFail(id);

  const author = await book.getAuthor();

  ctx.body = ctx.app.serialize('author', author);
});

router.post('/', async (ctx) => {
  const attrs = ctx.request.body.data.attributes;
  attrs.AuthorId = ctx.request.body.data.relationships.author.data.id;
  attrs.publishDate = attrs['publish-date'];

  const book = await ctx.app.db.Book.create(attrs);

  ctx.body = ctx.app.serialize('book', book);
});

router.patch('/:id', async (ctx) => {
  const attrs = ctx.request.body.data.attributes;
  attrs.AuthorId = ctx.request.body.data.relationships.author.data.id;
  attrs.publishDate = attrs['publish-date'];

  const id = ctx.params.id;
  const book = await ctx.app.db.Book.findOrFail(id);

  book.set(attrs);
  await book.save();

  ctx.body = ctx.app.serialize('book', book);
});

router.del('/:id', async (ctx) => {
  const id = ctx.params.id;
  const book = await ctx.app.db.Book.findOrFail(id);
  await book.destroy();

  ctx.status = 204;
  ctx.body = null;
});

export default router.routes();
