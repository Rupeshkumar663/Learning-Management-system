import Course from "../model/courseModel.js";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

//searchWithAi-----------------------------------------------------------------
export const searchWithAi=async(req,res)=>{
  try{
    const { input }=req.body;
    if(!input){
      return res.status(400).json({ message: "Search query is required" });
    }
    let keyword=input;
    try {
      if(process.env.GEMINI_API_KEY){
        const ai=new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY,});
         const prompt=`
            You are an intelligent assistant for an LMS platform.
            A user will type any query about what they want to learn.
           your task is to understand the intent and return one **most relevant keyword** from the following list of course categories and levels:

           - App Development
           - AI/ML
           - AI Tools
           - Data Science
           - Data Analytics
           - UI UX Designing
           - Web Development
           - Others
           - Beginner
           - Intermediate
           - Advanced

           Only return one exact keyword. No explanation.
           Query: ${input}
          `;

        const response=await ai.models.generateContent({
          model:"gemini-1.5-flash",
          contents:prompt,
        });
        const text =response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        if(text){
          keyword=text;
        }
      }
    } catch(error){
      console.log("GEMINI ERROR:", error.message);
    }
    const normalize=(text)=>text.toLowerCase().replace(/[^a-z0-9]/g, "");
    const cleanInput=input.toLowerCase();
    const cleanKeyword=keyword.toLowerCase().replace("/", " ");
    const words=cleanInput.split(" ");
    const courses=await Course.find({
      isPublished: true,
      $or: [
        { title: { $regex: cleanInput, $options: "i" } },
        { subTitle: { $regex: cleanInput, $options: "i" } },
        { description: { $regex: cleanInput, $options: "i" } },
        { category: { $regex: cleanInput, $options: "i" } },
        { category: { $regex: cleanKeyword, $options: "i" } },
        { level: { $regex: cleanInput, $options: "i" } },
        { level: { $regex: cleanKeyword, $options: "i" } },
        ...words.map((word)=>({
          title:{ $regex: word, $options: "i" },
        })),
        ...words.map((word)=>({
          description:{ $regex: word, $options: "i" },
        })),
      ],
    });
    console.log("COURSES FOUND:",courses.length);
    return res.status(200).json(courses);
  } catch(error){
    console.log("SERVER ERROR:",error);
    return res.status(500).json({message:"Internal Server Error",error});
  }
};