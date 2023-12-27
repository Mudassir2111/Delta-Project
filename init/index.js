const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/Hydra";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// const initDB = ()=> {
//    Listing.deleteMany({}).then(() => {
//     console.log("connected to DB");
//   })
//   .catch((err) => {
//     console.log(err);
//   });
//    Listing.insertMany(initData.data).then(() => {
//     console.log("connected to DB");
//   })
//   .catch((err) => {
//     console.log(err);
//   });
//   console.log("data was initialized");
// };

const initDB = async ()=>{
  await Listing.deleteMany({});
initData.data =  initData.data.map((obj)=>({
  ...obj,
   owner: "6583e5a96e2ab006bcdee932",
  }));
  await Listing.insertMany(initData.data);
  console.log("data initialized")
}


initDB(); 