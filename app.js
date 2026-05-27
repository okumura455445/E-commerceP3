require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const passport = require('./config/passport');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const authRoutes = require('./routes/authRoutes');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const productRoutes = require('./routes/productRoutes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/products', productRoutes);
app.use('/auth', authRoutes);  // /auth/register, /auth/login, etc.


app.use(notFound);
app.use(errorHandler);

module.exports = app;


