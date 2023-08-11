const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const userRouter = require('./routes/userRoutes');
const fileRouter = require('./routes/fileRoutes');

const app = express();

// Middleware
app.use(morgan('tiny'));
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.use('/', userRouter);
app.use('/buckets', fileRouter);

module.exports = app;
