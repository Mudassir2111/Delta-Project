if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
};


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const {listingSchema} = require("./schema.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const flash = require("connect-flash");


const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js"); 

// const reviews = request("./routes/review.js");
const listingRouter = require("./routes/listing.js");
const userRouter = require("./routes/user.js");
const { request } = require("http");


 const dbUrl = process.env.ATLASDB_URL;


main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({
  mongoUrl : dbUrl,
   crypto :{
    secret : process.env.SECRET,
  },
   touchAfter : 24 * 3600,

});

store.on("error",()=>{
  console.log("Error in mongo session store" , err);
})

const sessionOptions = {
  store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true, 
    cookie :{
      expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge : 7 * 24 * 60 * 60 * 1000,
      httpOnly : true,
    },
};


app.get("/",(req,res)=>{
  res.send("<b> <u>Page not found</u></b>")
});




app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.success = req.flash("error");
    res.locals.currUser = req.user; 
    next();
});

// app.get("/demouser", async (req,res)=>{
//      let fakeUser = new User({
//       email : "student@gmail.com",
//       username : "delta-student",
//      });

//     let registeredUser =await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// });


app.use("/listings",listingRouter)
app.use("/", userRouter);


const validateReview =(req,res,next)=>{
  let {error} = listingSchema.validate(res.body);
  if(error){
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400,errMsg);
  }else{
    next();
  }
};




             
// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });

// app.all("*" , (res , res , next)=>{
//   next( new ExpressError(404,res.render("listings/error.ejs")));
  
 
// });
    
// app.use((err)=>{
//  let {statusCode,message} = err;
  
// });

app.listen(8080, () => {  
  console.log("server is listening to port 8080");
});