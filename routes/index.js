import Router from 'koa-router';
import status from './status';

const router = new Router();

router.use('/', status);

export default router;
