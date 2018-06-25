import Router from 'koa-router';
import status from './status';
import author from './author';
import book from './book';

const router = new Router();

router.use('/', status);
router.use('/authors', author);
router.use('/books', book);

export default router;
