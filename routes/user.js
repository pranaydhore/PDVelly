
const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const listingController = require("../controllers/users.js");

// Middleware to check if the user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    req.flash("error", "You must be signed in first!");
    res.redirect("/login");
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

// ==========================
// PROFILE PAGE ROUTE
// GET /user/profile
router.get(
    "/profile",
    isLoggedIn,
    wrapAsync(async (req, res) => {
        const user = await User.findById(req.user._id).populate('listings');
        // Add dummy fallback arrays so EJS won't fail if not present
        user.listings = user.listings || [];
        user.history = user.history || [];
        user.favorites = user.favorites || [];
        res.render("users/profile", { user, active: "profile" });
    })
);

router.get('/favorites', isLoggedIn, async (req, res) => {
  const user = await User.findById(req.user._id).populate('favorites');
  res.render('users/favorites', { user, active: 'favorites' });
});



module.exports = router;
