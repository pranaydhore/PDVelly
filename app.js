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

// Ensure environment variables are present
if (!process.env.ATLASDB_URL) {
  throw new Error('ATLASDB_URL not set in environment variables');
}
if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET not set in environment variables');
}

const dbUrl = process.env.ATLASDB_URL;

// MongoDB connection
mongoose.connect(dbUrl)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1); // Exit if DB connection fails
  });

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Create MongoDB store for sessions
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SESSION_SECRET,
  },
  touchAfter: 24 * 3600 // time period in seconds
});

store.on("error", (err) => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionConfig = {
  store,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
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

// CRITICAL: Middleware to make flash messages and current user available everywhere
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currUser = req.user || null; // This fixes the "currUser is not defined" error
  next();
});

// Add a root route to handle the base URL
app.get('/', (req, res) => {
  res.redirect('/listings');
});

// Register routes
app.use('/user', userRouter);
app.use('/bookings', bookingsRouter);
app.use('/listings', listingsRouter);
app.use('/listings/:id/reviews', reviewsRouter);
app.use('/', userRouter);

// 404 handler - last middleware
app.use((req, res) => {
  res.status(404).render('listings/error', { 
    statusCode: 404, 
    message: 'Page Not Found' 
  });
});

// Global error handler middleware
app.use((err, req, res, next) => {
  if (err.name === 'CastError') {
    err = new ExpressError(404, 'Page Not Found');
  }
  const { statusCode = 500, message = 'Something went wrong' } = err;
  
  // Ensure currUser is available even in error pages
  res.locals.currUser = req.user || null;
  
  res.status(statusCode).render('listings/error', { statusCode, message });
  
  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }
});

const PORT = process.env.PORT || 10000; // Use port 10000 for Render
app.listen(PORT, '0.0.0.0', () => { // Bind to all interfaces
  console.log(`Server started on http://localhost:${PORT}`);
});
