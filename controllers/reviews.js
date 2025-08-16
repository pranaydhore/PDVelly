const Review=require("../models/review.js");
const Listing=require("../models/listing.js");

// create review
module.exports.createReview=async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    const review = new Review(req.body.review);
    review.author=req.user._id;
    console.log(review);
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    req.flash("success", "Review added successfully!");
    res.redirect(`/listings/${listing._id}`);
};

// delete review
module.exports.deleteReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted successfully!");
    res.redirect(`/listings/${id}`);
};