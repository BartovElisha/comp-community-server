require('dotenv').config();  // Add configuration data from .env file (gitignored).
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const headers = require('./middleware/headers');
const auth = require('./middleware/auth');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var companiesRouter = require('./routes/companies');
var componentsRouter = require('./routes/components');
var postsRouter = require('./routes/posts');
var cardsRouter = require('./routes/cards');

var app = express();

// Logger Section
// app.use(morgan('dev'));
app.use(logger('tiny'));
// app.use(logger('combined'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(headers);

// home Router
app.use('/', indexRouter);

// users Router
app.use('/users', usersRouter);

// companies Router
app.use('/companies', auth, companiesRouter);

// components Router
app.use('/components', auth, componentsRouter);
app.use('/allcomponents', componentsRouter);  // Get all components for home page (No sign in requiered)

// posts Router
app.use('/posts', auth, postsRouter);
app.use('/allposts', postsRouter);

// cards Router
app.use('/cards', auth, cardsRouter);
app.use('/allcards', cardsRouter);

module.exports = app;
