import Router from 'koa-router';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { promisify } from 'util';
import UnauthorizedError from '../errors/unauthorized';
import NotFoundError from '../errors/not-found';

const sign = promisify(jwt.sign);

const router = new Router();

router.post('/', async (ctx) => {
  const { email, password } = ctx.request.body;

  try {
    const user = await ctx.app.db.User.findByEmail(email);

    if (!await bcrypt.compare(password, user.passwordHash)) {
      throw new UnauthorizedError();
    }

    const data = {
      id: user.id,
      email: user.email,
      username: user.username
    };

    const token = await sign({
      data, sub: user.id
    }, process.env.JWT_SECRET, {
      expiresIn: '2h'
    });

    ctx.body = {
      token
    };
  } catch (error) {
    if (error.constructor === NotFoundError) {
      await bcrypt.hash(password, 10);
    }

    throw new UnauthorizedError('Error logging in user with that email and password');
  }
});

export default router.routes();
