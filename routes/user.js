const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware.js");
const listingController=require("../controllers/users.js");

// signup
router.route("/signup")
.get(listingController.renderSignUp)
.post(wrapAsync(listingController.signUpUser));

// login
router.route("/login")
.get(listingController.loginPage)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),listingController.login);

// logout
router.get("/logout",listingController.logoutPage);



module.exports=router;