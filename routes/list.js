const express=require("express");
const router=express.Router();
const wrapAsync =require("../utils/wrapAsync.js");
const {listingSchema,reviewSchema}=require("../Schema.js");
const Listing=require("../models/listing.js");
const ExpressError =require("../utils/ExpressError.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
//const {index}=require("../controllers/listings.js");
const listingController=require("../controllers/listings.js");
const multer=require('multer');
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});


router.route("/")
// Index Route
.get( wrapAsync(listingController.index))
// Create Route
.post(isLoggedIn,upload.single('listing[image][url]'), validateListing, wrapAsync(listingController.createListing));
// New Route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
// shoe route
.get( listingController.showListing)
// update route
.put(isLoggedIn,isOwner,upload.single('listing[image][url]'),validateListing,wrapAsync(listingController.updateListing))
//delete route
.delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));


// Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));
// Show all listings


module.exports=router;