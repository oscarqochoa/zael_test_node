import logger from 'morgan';
import express from 'express';
import cookieParser from 'cookie-parser';

// Routes
import indexRouter from './routes/index';
import migrationRouter from './routes/migration';

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api', indexRouter);
app.use('/api/migration', migrationRouter);

export default app;
