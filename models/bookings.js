const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { ref } = require("joi");

// const bookingSchema = new mongoose.Schema({
//   listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   createdAt: { type: Date, default: Date.now }
// });

const bookingSchema = new Schema(
  {
    listing: { type: Schema.Types.ObjectId, ref: 'Listing', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    checkIn: Date,
    checkOut: Date,
    guests: { type: Number, default: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);