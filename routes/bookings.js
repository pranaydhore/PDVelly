const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Listing = require("../models/listing");
const { isLoggedIn } = require("../middleware");

// Add favorite
// router.post("/favorites/:id", isLoggedIn, async (req, res) => {
//   try {
//     const listingId = req.params.id;
//     const user = await User.findById(req.user._id);

//     if (!user.favorites) {
//       user.favorites = []; // initialize if undefined
//     }

//     if (!user.favorites.includes(listingId)) {
//       user.favorites.push(listingId);
//       await user.save();
//       req.flash("success", "Added to favorites!");
//     } else {
//       req.flash("info", "Already in favorites.");
//     }

//     res.redirect("back");
//   } catch (err) {
//     console.error(err);
//     req.flash("error", "Something went wrong!");
//     res.redirect("back");
//   }
// });

// Add/remove favorite with toggle (AJAX version)
router.post("/favorites/:id", isLoggedIn, async (req, res) => {
  try {
    const listingId = req.params.id;
    const user = await User.findById(req.user._id);

    if (!user.favorites) {
      user.favorites = [];
    }

    let action;
    if (user.favorites.includes(listingId)) {
      // Remove favorite
      user.favorites = user.favorites.filter(
        (favId) => favId.toString() !== listingId.toString()
      );
      action = "removed";
    } else {
      // Add favorite
      user.favorites.push(listingId);
      action = "added";
    }

    await user.save();
    res.json({ success: true, action });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
});


// Show favorites page
router.get("/favorites", isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("favorites");
    res.render("users/favorites", { favorites: user.favorites });
  } catch (err) {
    console.error(err);
    res.render("users/favorites", { favorites: [] });
  }
});

module.exports = router;
