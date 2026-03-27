import mongoose from "mongoose"

const lectureSchema=new mongoose.Schema({
 title:{
    type:String,
    required:true
  },
  videoUrl:{
    type:String
  },
  isPreviewFree:{
    type:Boolean
  }
},{timestamps:true})

const Lecture=mongoose.model("Lecture",lectureSchema)
export default Lecture