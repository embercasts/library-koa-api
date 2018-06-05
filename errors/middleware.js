import NotFoundError from './not-found';

export default async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    switch (err.constructor) {
      case NotFoundError:
        ctx.status = 404;

        return ctx.body = {
          errors: [
            {
              code: 404,
              title: 'Not Found',
              detail: `${err.modelName} not found with the id '${err.id}'`
            }
          ]
        };
      default:
        ctx.status = 500;

        return ctx.body = {
          errors: [
            {
              code: 500,
              title: 'Internal Server Error',
              detail: err.message
            }
          ]
        };
    }
  }
};
