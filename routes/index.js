import Router from 'koa-router';
import status from './status';
import author from './author';
import book from './book';
import review from './review';

const router = new Router();

router.use('/', status);
router.use('/authors', author);
router.use('/books', book);
router.use('/reviews', review);

export default router;
