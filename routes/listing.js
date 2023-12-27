const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner} = require("../middlewere.js");
const multer = require("multer");
const {storage}= require("../cloudConfig.js");
const upload = multer({storage});
// const mbxGeocoding = require('@mapbox/mapbox-sdk/services/tilesets');
// const map = 'pk.eyJ1IjoiZGVsdGEtc3R1ZHVlbnQiLCJhIjoiY2xvMDk0MTVhMTJ3ZDJrcGR5ZDFkaHl4ciJ9.Gj2VU1wvxc7rFVt5E4KLOQ';
// const mapToken = process.env.map;
// const geocodingClient = mbxGeocoding({ accessToken: mapToken });










const validateListing =(req,res,next)=>{
  let {error} = listingSchema.validate(res.body);
  if(error){
  let errMsg = error.details.map((el) => el.message).join(",");
  throw new ExpressError(400,errMsg);
  }else{
        next();
  }
};



//Index Route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  }));

  
  
  //New Route
  router.get("/new", isLoggedIn ,(req, res) => {
    res.render("listings/new.ejs");
  });
  
  //Show Route
  router.get("/:id",
   wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate("owner");

    if(!listing){
       req.flash("error","Listing your requested for does not exist!");
       res.redirect("/listings");
    }
      console.log(listing);
    res.render("listings/show.ejs", { listing });
  }));




  //Create Route
router.post("/",
 isLoggedIn,
 validateListing,
wrapAsync (async(req, res, next) => {
let result = listingSchema.validate(req.body);
console.log(result);
if(result.error){
throw new ExpressError(400,result.error);
}
const newListing = new Listing(req.body.listing);

newListing.owner = req.user._id;
await newListing.save();
req.flash("success" , "new listing created!");
res.redirect("/listings");
})
);

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  }));
  
  //Update Route
  router.put("/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success" , "Upadated Listing!");
    res.redirect(`/listings/${id}`);
  }));
  
  //Delete Route
  router.delete("/:id",isLoggedIn,isOwner, wrapAsync(async (req,res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("error" , " Listing Deleted!");
    res.redirect("/listings");
  }));
  
  module.exports = router;