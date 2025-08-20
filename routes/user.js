const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const listingController = require("../controllers/users.js");
const userController = require('../controllers/users'); // Adjust path if needed
const Booking = require("../models/bookings.js");

function isLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) { // Passport authentication check
    req.flash('error', 'You must be signed in');
    return res.redirect('/user/login');
  }
  next();
}



// signup
router.route("/signup")
    .get(listingController.renderSignUp)
    .post(wrapAsync(listingController.signUpUser));

// login
router.route("/login")
    .get(listingController.loginPage)
    .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), listingController.login);

// logout
router.get("/logout", listingController.logoutPage);



router.get('/profile', isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('listings')
      .populate('favorites');

    // Populate listings inside bookings
    const bookings = await Booking.find({ user: req.user._id })
      .populate('listing'); // Important: populate the listing field

    res.render('users/profile', { user, bookings, active: 'profile' });
  } catch (err) {
    console.error("PROFILE ROUTE ERROR:", err);
    res.status(500).send('Server Error: ' + err.message);
  }
});


// ----------------- BECOME HOST -----------------
router.get('/become-host', isLoggedIn, async (req, res) => {
  try {
    const userId = req.session.userId;
    await User.findByIdAndUpdate(userId, { isHost: true });
    res.redirect('/user/profile');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
