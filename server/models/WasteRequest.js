import mongoose from 'mongoose';
const schema=new mongoose.Schema({user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},wasteType:String,quantity:String,address:String,pickupDate:Date,assignedCollector:{type:mongoose.Schema.Types.ObjectId,ref:'User',default:null},status:{type:String,default:'Pending'},collectionPhoto:String,verificationStatus:{type:String,default:'Not Submitted'},rejectionReason:String,verifiedBy:{type:mongoose.Schema.Types.ObjectId,ref:'User',default:null}},{timestamps:true});
export default mongoose.model('WasteRequest',schema);
