import Router from 'koa-router';
import status from './status';
import author from './author';
import book from './book';
import review from './review';
import user from './user';

const router = new Router();

router.use('/', status);
router.use('/authors', author);
router.use('/books', book);
router.use('/reviews', review);
router.use('/users', user);

export default router;
