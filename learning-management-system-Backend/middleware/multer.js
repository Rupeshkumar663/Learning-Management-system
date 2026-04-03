import multer from "multer";
import fs from "fs";

if(!fs.existsSync("uploads")){
  fs.mkdirSync("uploads");
}

const storage=multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,"uploads/");
  },
  filename:(req,file,cb)=>{
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const fileFilter=(req,file,cb)=>{
  if(file.mimetype.startsWith("image") || file.mimetype.startsWith("video")){
    cb(null,true);
  } else{
    cb(new Error("Only image & video allowed"),false);
  }
};

export const upload=multer({
  storage,
  fileFilter,
  limits:{
    fileSize:100*1024*1024 
  }
});