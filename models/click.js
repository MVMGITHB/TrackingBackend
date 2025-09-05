// import mongoose from 'mongoose';

// const clickSchema = new mongoose.Schema({
//   campaignId: String,
//   pubId: String,
//   clickId: String,
//   deviceId: String,
//   ip: String,
//   userAgent: String,
//   referrer: String,
//   isUnique: Boolean,

//   originalClick:{
//     type:String,
//   },
//   timestamp: { type: Date, default: Date.now },
  
// });

// export default mongoose.model('Click', clickSchema);



// // import mongoose from 'mongoose';

// // const clickSchema = new mongoose.Schema({
// //   campaignId: String,
// //   pubId: String,
// //   clickId: String,
// //   ip: String,
// //   userAgent: String,
// //   referrer: String,
// //   timestamp: { type: Date, default: Date.now },
// //   isUnique: Boolean
// // });

// // export default mongoose.model('Click', clickSchema);


import mongoose from 'mongoose';

const clickSchema = new mongoose.Schema({
  campaignId: { type: String, required: true, index: true },
  pubId: { type: String, required: true, index: true },
  clickId: { type: String, required: true, unique: true },
  deviceId: { type: String, index: true },   // 👈 useful for fast uniqueness checks
  ip: String,
  userAgent: String,
  referrer: String,
  isUnique: { type: Boolean, default: true },
  originalClick: String,
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Click', clickSchema);
