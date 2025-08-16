const Listing=require("../models/listing.js");

module.exports.index=async (req,res)=>{
   const allListings= await Listing.find({});
   res.render("./listings/index.ejs",{allListings});
};

// new form
module.exports.renderNewForm=(req,res)=>{
  res.render("./listings/new.ejs");
};

// show route
module.exports.showListing=async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate("owner")
      .populate({path:"reviews",
        populate:{
          path:"author",
        }
      });
    if (!listing) {
      req.flash('error', 'Listing you requested for does not exist!');
      return res.redirect('/listings');
    }
    res.render('listings/show', { listing });
  } catch (err) {
    next(err);  // Pass error to error handling middleware
  }
};

// create Listings
module.exports.createListing=async (req, res, next) => {
    let url=req.file.path;
    let filename=req.file.filename;
    console.log(url,"..",filename);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;   // ✅ attach logged-in user as owner
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect(`/listings/${newListing._id}`);
};

//edit form
module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error","Listings you requested for does not exist!");
        res.redirect("/listings");
    }
    
    res.render("./listings/edit.ejs",{listing,originalImage});
};

//update listings
module.exports.updateListing=async (req,res)=>{
    let {id}=req.params;
    await Listing.findById(id);
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !="undefined") {
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
    req.flash("success", "Listing Update Successfully !");
    res.redirect(`/listings/${id}`);
};

// delete listings
module.exports.deleteListing=async(req,res)=>{
    let {id}=req.params;
    let deletedListings=await Listing.findByIdAndDelete(id);
    console.log(deletedListings);
    req.flash("success","Listing Deleted !")
    res.redirect("/listings");
};