import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import UnauthorizedError from '../errors/unauthorized';

const verify = promisify(jwt.verify);

export default async (ctx, next) => {
  try {
    const authHeader = ctx.header.authorization || '';

    const token = authHeader.replace('Bearer ', '');

    const result = await verify(token, process.env.JWT_SECRET);

    ctx.currentUser = await ctx.app.db.User.findOrFail(result.sub);
  } catch (e) {
    throw new UnauthorizedError();
  }

  return await next(ctx);
}
