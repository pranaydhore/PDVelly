
if(process.env.NODE_ENV !="production") {
    require('dotenv').config();
}
require('dotenv').config();
console.log(process.env);
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync =require("./utils/wrapAsync.js");
const ExpressError =require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./Schema.js");
const Review=require("./models/review.js");
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");


const listingsRouter=require("./routes/list.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
// const dbUrl=process.env.ATLASDB_URL;

main().then(()=>{
    console.log("connected Database..");
}).catch((err)=>{
    console.log("some error occured ..");
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

// app.get("/",(req,res)=>{
//     res.send("connection successfully.");
// });


const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized: true,
    cookie :{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currUser=req.user;
  next();
});

// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"sigma-student"
//     });
//     let registerUser=await User.register(fakeUser,"pranaydhore");
//     res.send(registerUser);
// })


app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

// handle 404 errors
app.use((req, res) => {
    res.status(404).render("listings/error", {
        statusCode: 404,
        message: "Page Not Found"
    });
});


// global middleware
app.use((err, req, res, next) => {
    if (err.name === "CastError") {
        err = new ExpressError(404, "Page Not Found");
    }
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("listings/error", { statusCode, message });
    console.log(message);
});


app.listen(8888,()=>{
    console.log("app listening on port 8888.");
});

