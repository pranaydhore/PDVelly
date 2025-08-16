// const mongoose=require("mongoose");
// const review = require("./review");
// const Schema=mongoose.Schema;

// const listingSchema= new Schema({
//     title:{
//         type:String,
//         required:true
//     },
//     description:{
//         type:String,
//     },
//     image:{
//          url:{
//             type:String,
//             default:"https://images.unsplash.com/photo-1682685797366-715d29e33f9d?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8",
//         set:(v)=>v==="" ? "https://images.unsplash.com/photo-1682685797366-715d29e33f9d?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8" : v,
//         },
//         filename:{
//             type:String,
//         },
        
//     },
//     price:{
//         type:Number,
//     },
//     location:{
//         type:String,
//     },
//     country:{
//         type:String,
//     },
//     reviews :{
//         type:Schema.Types.ObjectId,
//         ref:"Review",
//     }
// });

// const Listing=mongoose.model("Listing", listingSchema);
// module.exports=Listing;

// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
// const Review=require("./review.js")

// const listingSchema = new Schema({
//     title: {
//         type: String,
//         required: true
//     },
//     description: String,
//     image: {
//         url: {
//             type: String,
//             default: "https://images.unsplash.com/photo-1682685797366-715d29e33f9d?w=1000&auto=format&fit=crop&q=60",
//             set: (v) => v === "" ? "https://images.unsplash.com/photo-1682685797366-715d29e33f9d?w=1000&auto=format&fit=crop&q=60" : v
//         },
//         filename: String
//     },
//     price: Number,
//     location: String,
//     country: String,
//     reviews: [
//         {
//             type: Schema.Types.ObjectId,
//             ref: "Review"
//         }
//     ]
// });

// listingSchema.post("findOneAndDelete",async(listing)=>{
//     if(listing) {
//         await Review.deleteMany({_id:{$in:listing.reviews}});
//     }
    
// });

// const Listing = mongoose.model("Listing", listingSchema);
// module.exports = Listing;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { ref } = require("joi");

const DEFAULT_IMAGE_URL = "https://images.unsplash.com/photo-1682685797366-715d29e33f9d?w=1000&auto=format&fit=crop&q=60";

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        url: {
            type: String,
            default: DEFAULT_IMAGE_URL,
            set: v => (v && v.trim() !== "") ? v : DEFAULT_IMAGE_URL
        },
        filename: {
            type: String,
            default: "default.jpg",
            set: v => (v && v.trim() !== "") ? v : "default.jpg"
        }
    },
    price: {
        type: Number,
        default: 0
    },
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner : {
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    category :{
        type:String,
        enum:["moutains","arctic","farms"]
    }
});

// Middleware to delete related reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
