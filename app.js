require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('./models/user');
const bookingsRouter = require('./routes/bookings');
const listingsRouter = require('./routes/list');
const reviewsRouter = require('./routes/review');
const userRouter = require('./routes/user');
const ExpressError = require('./utils/ExpressError');

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/wanderlust";

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'mysupersecretcode',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: MONGO_URL }),
  cookie: {
    httpOnly: true,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    maxAge: 7 * 24 * 60 * 60 * 1000,
  }
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to make flash messages and current user available in all templates
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currUser = req.user;
  next();
});

const userRoutes = require('./routes/user');
app.use('/user', userRoutes);

// Register routes - MUST be before the 404 handler
app.use('/bookings', bookingsRouter);
app.use('/listings', listingsRouter);
app.use('/listings/:id/reviews', reviewsRouter);
// app.use('/', userRouter);
app.use('/', userRoutes);

// 404 handler - last middleware
app.use((req, res) => {
  res.status(404).render('listings/error', { statusCode: 404, message: 'Page Not Found' });
});

app.use((req, res) => {
  res.status(404).render('listings/error', { statusCode: 404, message: 'Page Not Found' });
});


// Global error handler middleware
app.use((err, req, res, next) => {
  if (err.name === 'CastError') {
    err = new ExpressError(404, 'Page Not Found');
  }
  const { statusCode = 500, message = 'Something went wrong' } = err;
  res.status(statusCode).render('listings/error', { statusCode, message });
  console.error(err);
});

const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
