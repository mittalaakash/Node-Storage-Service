const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

// const userRouter = require('./routes/userRoutes');
const fileRouter = require('./Routes/fileRoutes');
const AppError = require('./Utils/appError');

const app = express();

// Middleware
app.use(morgan('tiny'));
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Routes
// app.use('/', userRouter);
app.use('/buckets', fileRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//global error hadnler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
});

module.exports = app;
