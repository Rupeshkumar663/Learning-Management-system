import mongoose from "mongoose";
import uploadOnCloudinary from "../config/cloudinary.js";
import Course from "../model/courseModel.js";
import Lecture from "../model/lectureModel.js";

export const createCourse = async (req, res) => {
  try {
    const { title, category, description } = req.body;

    if (!title || !category) {
      return res.status(400).json({ message: "Title and Category are required" });
    }

    const course = await Course.create({
      title,
      category,
      creator: req.userId
    });

    return res.status(201).json(course);

  } catch (error) {
    return res.status(500).json({ message: `CreateCourse error: ${error.message}` });
  }
};



export const getPublishedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished:true}).populate("lectures reviews");
    if(!courses){
      return res.status(400).json({message:"Course are not found"})
    }
    return res.status(200).json(courses);

  } catch (error) {
    return res.status(500).json({ message: `Failed to get ispublished courses ${error}`});
  }
};



export const getCreaterCourses = async (req, res) => {
  try {
    const userId = req.userId;

    const courses = await Course.find({ creator: userId });

    return res.status(200).json(courses);

  } catch (error) {
    return res.status(500).json({ message: `Failed to fetch creator courses: ${error.message}` });
  }
};



export const editCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, subTitle, description, category, level, isPublished, price } = req.body;

    let thumbnail;
    if (req.file) {
      thumbnail = await uploadOnCloudinary(req.file.path);
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(400).json({ message: "Course not found" });
    }

    const updateData = {
      title,
      subTitle,
      description,
      category,
      level,
      isPublished,
      price,
      ...(thumbnail && { thumbnail })
    };

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      updateData,
      { new: true }
    );

    return res.status(200).json(updatedCourse);

  } catch (error) {
    return res.status(500).json({ message: `Failed to edit course: ${error.message}` });
  }
};



export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(400).json({ message: "Course not found" });
    }

    return res.status(200).json(course);

  } catch (error) {
    return res.status(500).json({ message: `Failed to get course: ${error.message}` });
  }
};



export const removeCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(400).json({ message: "Course not found" });
    }

    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({ message: "Course removed" });

  } catch (error) {
    return res.status(500).json({ message: `Failed to delete course: ${error.message}` });
  }
};


//for Lecture-------------------------
export const createLecture = async (req, res) => {
  try {
    const { title } = req.body;
    const { courseId } = req.params;

    if (!title || !courseId) {
      return res.status(400).json({ message: "lectureTitle is required" });
    }
    const lecture = await Lecture.create({ title});
    const course = await Course.findById(courseId);
    if (course) {
      course.lectures.push(lecture._id);
      await course.save();
    }

    const populatedCourse = await Course
      .findById(courseId)
      .populate("lectures");

    return res.status(201).json({
      lecture,
      course: populatedCourse
    });
  } catch (error) {
    return res.status(500).json({
      message: `Failed to create Lecture ${error.message}`,
    });
  }
};


export const getCourseLecture = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid courseId" });
    }

    const course = await Course
      .findById(courseId)
      .populate("lectures");

    if (!course) {
      return res.status(404).json({ message: "Course is not found" });
    }

    return res.status(200).json({ course });
  } catch (error) {
    return res.status(500).json({
      message: `Failed to getCourse Lecture ${error.message}`,
    });
  }
};


export const editLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const { isPreviewFree, lectureTitle } = req.body;

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({ message: "Lecture is not found" });
    }

    if (req.file) {
      const videoUrl = await uploadOnCloudinary(req.file.path);
      lecture.videoUrl = videoUrl;
    }

    if (lectureTitle) {
      lecture.title = lectureTitle;
    }

    lecture.isPreviewFree = isPreviewFree;
    await lecture.save(); 

    return res.status(200).json({ lecture });
  } catch (error) {
    return res.status(500).json({
      message: `Failed to Edit Lecture ${error.message}`,
    });
  }
};


export const removeLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;

    const lecture = await Lecture.findByIdAndDelete(lectureId);
    if (!lecture) {
      return res.status(404).json({ message: "Lecture is not found" });
    }

    await Course.updateOne(
      { lectures: lectureId },
      { $pull: { lectures: lectureId } }
    );

    return res.status(200).json({
      message: "Lecture Removed Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: `Failed to remove Lecture ${error.message}`,
    });
  }
};


//get Creator------------------------------
export const getCreatorById=async(req,res)=>{
  try{
     const {userId}=req.body
     const user=await user.findById(userId).select("-password")
     if(!user){
      return res.status(404).json({message:"User is not Found"})
     }
     return res.status(200).json(user)
  } catch(error){
    return res.status(500).json({message:`Failed to get creator ${error}`})
  }
}