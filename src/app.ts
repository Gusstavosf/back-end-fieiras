import express from 'express'
import routes from './infra/api/express/routes/route.js';
import ErrorHandler from './infra/middlewares/errorHandler.js';
import Handler404 from './infra/middlewares/handler404.js';

const app = express();

app.use(express.json());
app.use(routes);

app.use(Handler404)

app.use(ErrorHandler)

export default app; 