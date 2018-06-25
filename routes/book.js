import Router from 'koa-router';
import Sequelize from 'sequelize';

const router = new Router();

const serialize = (model) => {
  return {
    type: 'books',
    id: model.id,
    attributes: {
      title: model.title,
      isbn: model.isbn,
      'publish-date': model.publishDate
    },
    links: {
      self: `/books/${model.id}`
    }
  };
};

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

  ctx.body = { data: books.map(serialize) };
});

router.get('/:id', async (ctx) => {
  const id = ctx.params.id;
  const book = await ctx.app.db.Book.findOrFail(id);

  ctx.body = { data: serialize(book) };
});

router.post('/', async (ctx) => {
  const attrs = ctx.request.body.data.attributes;
  attrs.AuthorId = ctx.request.body.data.relationships.author.data.id;
  attrs.publishDate = attrs['publish-date'];

  const book = await ctx.app.db.Book.create(attrs);

  ctx.body = { data: serialize(book) };
});

router.patch('/:id', async (ctx) => {
  const attrs = ctx.request.body.data.attributes;
  attrs.AuthorId = ctx.request.body.data.relationships.author.data.id;
  attrs.publishDate = attrs['publish-date'];

  const id = ctx.params.id;
  const book = await ctx.app.db.Book.findOrFail(id);

  book.set(attrs);
  await book.save();

  ctx.body = { data: serialize(book) };
});

router.del('/:id', async (ctx) => {
  const id = ctx.params.id;
  const book = await ctx.app.db.Book.findOrFail(id);
  await book.destroy();

  ctx.status = 204;
  ctx.body = null;
});

export default router.routes();
