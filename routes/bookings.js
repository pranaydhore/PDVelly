const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Listing = require("../models/listing");
const { isLoggedIn } = require("../middleware");

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


module.exports = router;
