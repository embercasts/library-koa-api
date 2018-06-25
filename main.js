import Koa from 'koa';
import logger from 'koa-logger';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

import config from './config/app';
import router from './routes/index';
import db from './models/index';
import errorMiddlware from './errors/middleware';
import serialize from './resources/index';

const app = new Koa();
app.db = db;
app.serialize = serialize;

app.use(errorMiddlware);
app.use(logger());
app.use(cors());
app.use(bodyParser());

app.use(router.allowedMethods());
app.use(router.routes());

app.listen(config.port, () => {
  console.log(`Started Server on Port ${config.port}`);
});
