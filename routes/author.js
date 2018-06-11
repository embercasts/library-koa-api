import Router from 'koa-router';
import Sequelize from 'sequelize';

const router = new Router();

const serialize = (model) => {
  return {
    type: 'authors',
    id: model.id,
    attributes: {
      first: model.first,
      last: model.last
    },
    links: {
      self: `/authors/${model.id}`
    }
  };
}

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
      }
    });
  } else {
    authors = await ctx.app.db.Author.findAll();
  }

  ctx.body = { data: authors.map(serialize) };
});

router.get('/:id', async (ctx) => {
  const id = ctx.params.id;
  const author = await ctx.app.db.Author.findOrFail(id);

  ctx.body = { data: serialize(author) };
});

router.post('/', async (ctx) => {
  const attrs = ctx.request.body.data.attributes;
  const author = await ctx.app.db.Author.create(attrs);

  ctx.status = 201;
  ctx.set('Location', `/authors/${author.id}`);
  ctx.body = { data: serialize(author) };
});

router.patch('/:id', async (ctx) => {
  const attrs = ctx.request.body.data.attributes;
  const id = ctx.params.id;
  const author = await ctx.app.db.Author.findOrFail(id);

  author.set(attrs);
  await author.save();

  ctx.body = { data: serialize(author) };
});

router.del('/:id', async (ctx) => {
  const id = ctx.params.id;
  const author = await ctx.app.db.Author.findOrFail(id);
  await author.destroy();

  ctx.status = 204;
  ctx.body = null;
});

export default router.routes();















