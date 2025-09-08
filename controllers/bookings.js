const Booking = require("../models/bookings");
const Listing = require("../models/listing");

module.exports.reserveListing = async (req, res, next) => {
  try {
    const { id } = req.params; // listing id
    const { checkIn, checkOut, guests } = req.body;

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const booking = new Booking({
      listing: listing._id,
      user: req.user._id,
      checkIn,
      checkOut,
      guests
    });

    await booking.save();

    return res.json({ message: "Reserved successfully!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error, please try again." });
  }
};
