// const { findOneAndDelete } = require("../models/listing")

module.exports = (fn)=>{
return (req,res,next)=>{
      fn(req,res,next).catch(next);
};
};