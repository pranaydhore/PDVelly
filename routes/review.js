const express=require("express");
// const router=express.Router();
const router = express.Router({ mergeParams: true });
const wrapAsync =require("../utils/wrapAsync.js");
const ExpressError =require("../utils/ExpressError.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const{validateReview, isLoggedIn,isreviewAuthor}=require("../middleware.js");
const listingController=require("../controllers/reviews.js");

// create route
router.post("/",isLoggedIn,validateReview,wrapAsync(listingController.createReview));

// delete review route
router.delete("/:reviewId",isLoggedIn,isreviewAuthor, wrapAsync(listingController.deleteReview));

module.exports=router;