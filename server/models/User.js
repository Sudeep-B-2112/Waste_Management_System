import mongoose from 'mongoose';
const schema=new mongoose.Schema({name:{type:String,required:true},email:{type:String,required:true,unique:true,lowercase:true},password:{type:String,required:true},role:{type:String,enum:['user','admin','collector'],default:'user'},phone:String},{timestamps:true});
export default mongoose.model('User',schema);
