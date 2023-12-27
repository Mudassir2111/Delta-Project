const router = require("./listing");
// const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const {listingSchema} = require("../schema.js");
// const reviews = request("../routes/review.js")




// const validateReview =(req,res,next)=>{
//   let {error} = listingSchema.validate(res.body);
//   if(error){
//     let errMsg = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(400,errMsg);
//   }else{
//     next();
//   }
// };


//Delete Route
router.delete("/", wrapAsync(async (req,res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  }));

  // Reviews
// Post route
router.post("/:id/reviews",async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.Review);
    
    listing.reviews.push(newReview)
    
    await newReview.save();
    await listing.save();
    
    res.redirect(`/listing/${listing_id}`);
    });

    // module.exports = router;