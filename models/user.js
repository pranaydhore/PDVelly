const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const Schema = mongoose.Schema;

const historySchema = new Schema({
  action: String,
  date: { type: Date, default: Date.now }
});

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  listings: [
    {
      type: Schema.Types.ObjectId,
      ref: "Listing"
    }
  ],
  favorites: [
    {
      type: Schema.Types.ObjectId,
      ref: "Listing"
    }
  ],
  history: [historySchema]
}, { timestamps: true });

// 👉 this adds username + hash + salt, and .register(), .authenticate() methods
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
