const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("connected Database..");
}).catch((err)=>{
    console.log("some error occured ..");
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

// const initDB= async () =>{
//     await Listing.deleteMany({});
//     initData.data.map((obj)=>({...obj,owner:"689f06e9ed9923c65192e3fe",}));
//     await Listing.insertMany(initData.data);
//     console.log("data was initialize");
// };
const initDB = async () => {
  await Listing.deleteMany({});

  const dataWithOwner = initData.data.map((obj) => ({
    ...obj,
    owner: "689f06e9ed9923c65192e3fe", // example user ObjectId
  }));

  await Listing.insertMany(dataWithOwner);
  console.log("data was initialized");
};


initDB();