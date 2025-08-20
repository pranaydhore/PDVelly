const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const User=require("../models/user.js");
const Booking = require('../models/bookings.js');
// const userController = require('../controllers/users'); // Adjust path if needed
// render signup page
module.exports.renderSignUp=(req,res)=>{
    res.render("../views/users/signup.ejs");
};

// signup route
module.exports.signUpUser=async(req,res)=>{
    try {
        let {username,email,password}=req.body;
        const newUser=new User({email,username});
        const registeredUser=await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err) {
                return next(err);
            }
            req.flash("success","Welcome to PDVelly!")
            res.redirect("/listings");
        })
        
    } catch(err) {
        req.flash("error",err.message);
        res.redirect("/signup");
    };
    
};

// login page
module.exports.loginPage=(req,res)=>{
    res.render("../views/users/login.ejs");
};

module.exports.login=async(req,res)=>{
    req.flash("success","Welcome back to PDVelly!");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

// logout page
module.exports.logoutPage=(req,res)=>{
    req.logout((err)=>{
        if(err) {
            return next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/listings");
    })
};



module.exports.renderUserProfile = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('listing')
      .sort({ createdAt: -1 });
    res.render('users/profile', { user: req.user, bookings, active: 'profile' });
  } catch (e) {
    next(e);
  }
};

