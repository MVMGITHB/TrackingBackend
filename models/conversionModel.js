import mongoose from 'mongoose';

const conversionSchema = new mongoose.Schema({
  campaignId: String,
  pubId: String,
  clickId: String,
  amount: { type: String },
  sub1:String,
  sub2:String,
  sub3:String,
  sub4:String,
  sub5:String,
  sub6:String,
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Conversion', conversionSchema);
