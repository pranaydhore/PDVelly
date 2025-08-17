
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

// Optional: schema for history items
const historySchema = new Schema({
    action: String,
    date: { type: Date, default: Date.now }
});

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    listings: [
        {
            type: Schema.Types.ObjectId,
            ref: "Listing"
        }
    ],
    history: [historySchema] // add history array
}, { timestamps: true });

// Adds username and password fields, plus authentication methods
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
