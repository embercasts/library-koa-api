import NotFoundError from './not-found';
import { ValidationError, UniqueConstraintError } from 'sequelize';
import { underscore, dasherize } from 'inflected';
import UnauthorizedError from './unauthorized';

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
      case UnauthorizedError:
        ctx.status = 401;

        return ctx.body = {
          errors: [
            {
              status: 401,
              title: 'Unauthorized',
              detail: err.message
            }
          ]
        };
      case UniqueConstraintError:
      case ValidationError:
        ctx.status = 422;

        return ctx.body = {
          errors: err.errors.map((valError) => {
            const attr = dasherize(underscore(valError.path));
            const title = valError.validatorKey === 'notEmpty' ?
              `${attr} can't be blank` :
              valError.message;

            return {
              status: 422,
              code: 100,
              title,
              source: {
                pointer: `/data/attributes/${attr}`
              }
            };
          })
        };
      default:
        // debugger;
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
