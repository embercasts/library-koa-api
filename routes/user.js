import Router from 'koa-router';
import bcrypt from 'bcrypt';
import { promisify } from 'util';
import currentUser from '../middleware/current-user';

const hash = promisify(bcrypt.hash);

const router = new Router();

router.post('/', async (ctx) => {
  const attrs = ctx.getAttributes();
  attrs.passwordHash = await hash(attrs.password, 10);


  const user = await ctx.app.db.User.create(attrs);

  ctx.body = ctx.app.serialize('user', user);
});

router.get('/me', currentUser, async (ctx) => {
  ctx.body = ctx.app.serialize('user', ctx.currentUser);
});


export default router.routes();
