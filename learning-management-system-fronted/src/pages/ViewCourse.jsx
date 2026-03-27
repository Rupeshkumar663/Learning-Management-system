import React,{useEffect,useState} from "react";
import {FaArrowLeftLong} from "react-icons/fa6";
import {FaPlayCircle,FaLock,FaStar} from "react-icons/fa";
import {useDispatch,useSelector} from "react-redux";
import {useNavigate,useParams} from "react-router-dom";
import {setSelectedCourse} from "../redux/courseSlice";
import img from "../assets/empty.jpg";
import axios from "axios";
import {serverUrl} from "../App";
import Card from "../component/Card";
import {toast} from "react-toastify";
import { ClipLoader } from "react-spinners";

function ViewCourse(){

  const navigate=useNavigate();
  const {courseId}=useParams();
  const dispatch=useDispatch();

  const {userData}=useSelector((state)=>state.user);
  const {courseData,selectedCourse}=useSelector((state)=>state.course);

  const [selectedLecture,setSelectedLecture]=useState(null);
  const [creatorData,setCreatorData]=useState(null);
  const [creatorCourses,setCreatorCourses]=useState([]);
  const [isEnrolled,setIsEnrolled]=useState(false);

  const [rating,setRating]=useState(0);
  const [hover,setHover]=useState(null)
  const [comment,setComment]=useState("");
  const [loading,setloading]=useState(false)

  // Set Selected Course
  useEffect(()=>{
    if(courseData?.length>0){
      const course=courseData.find((c)=>c._id===courseId);
      if(course) dispatch(setSelectedCourse(course));
    }
  },[courseData,courseId,dispatch]);

  // Check Enrollment
  useEffect(()=>{
    if(userData?.enrolledCourses){
      const enrolled=userData.enrolledCourses.some(
        (c)=>
          (typeof c==="string"?c:c._id).toString()===
          courseId?.toString()
      );
      setIsEnrolled(enrolled);
    }
  },[userData,courseId]);

  // Get Creator
  useEffect(()=>{
    const getCreator=async()=>{
      if(selectedCourse?.creator){
        try{
          const res=await axios.post(
            serverUrl+"/api/course/creator",
            {userId:selectedCourse.creator},
            {withCredentials:true}
          );
          setCreatorData(res.data);
        }catch(err){
          console.log(err);
        }
      }
    };
    getCreator();
  },[selectedCourse]);

  // Get Creator Courses
  useEffect(()=>{
    if(creatorData?._id && courseData?.length>0){
      const courses=courseData.filter(
        (course)=>
          course.creator?.toString()===creatorData._id.toString() &&
          course._id!==courseId
      );
      setCreatorCourses(courses);
    }
  },[creatorData,courseData,courseId]);

  // Enroll
  const handleEnroll=async()=>{
    try{
      const orderData=await axios.post(
        serverUrl+"/api/order/razorpay-order",
        {userId:userData?._id,courseId},
        {withCredentials:true}
      );

      const options={
        key:import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount:orderData.data.amount,
        currency:"INR",
        name:"VIRTUAL COURSES",
        description:"COURSE ENROLLMENT PAYMENT",
        order_id:orderData.data.id,
        handler:async function(response){
          try{
            const verify=await axios.post(
              serverUrl+"/api/order/verifypayment",
              {...response,courseId,userId:userData?._id},
              {withCredentials:true}
            );
            setIsEnrolled(true);
            toast.success(verify.data.message);
          }catch(error){
            toast.error(error.response?.data?.message);
          }
        },
      };

      const rzp=new window.Razorpay(options);
      rzp.open();

    }catch(error){
      console.log(error)
      toast.error("Something went wrong while enrolling.");
    }
  };

  const handleReview=async()=>{
    setloading(true)
    try{
        const result=await axios.post(serverUrl+"/api/review/createreview",{rating,comment,courseId},{withCredentials:true})
        setloading(false)
        toast.success("Review Added")
        console.log(result.data)
        setRating(0)
        setComment("")
    } catch(error){
         console.log(error)
         setloading(false)
         toast.error(error.response.data.message)
         setRating(0)
         setComment("")
    }
  }

  const calculateAvgReview=(reviews)=>{
     if(!reviews || reviews.length===0){
      return 0;
     }
     const total=reviews.reduce((sum,review)=>sum+review.rating,0)
     return (total/reviews.length).toFixed(1)
  }
  
  const avgRating=calculateAvgReview(selectedCourse?.reviews)
  
  // Submit Rating
  const handleRatingSubmit=async()=>{
    if(!isEnrolled){
      return toast.error("Enroll first to rate this course");
    }

    try{
      await axios.post(
        serverUrl+"/api/course/rating",
        {courseId,rating},
        {withCredentials:true}
      );
      toast.success("Rating submitted successfully");
    }catch(error){
      toast.error(`Failed to submit rating:${error}`);
    }
  };

  if(!selectedCourse){
    return(
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return(
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6">

        {/* Top Section */}
        <div className="flex flex-col md:flex-row gap-6">

          <div className="w-full md:w-1/3">
            <FaArrowLeftLong
              className="cursor-pointer mb-3"
              onClick={()=>navigate("/")}
            />
            <img
              src={selectedCourse.thumbnail||img}
              alt="course"
              className="rounded-xl w-full"
            />
          </div>

          <div className="flex-1 space-y-2 mt-5">
            <h2 className="text-2xl font-bold">{selectedCourse.title}</h2>
            <p className="text-gray-600">{selectedCourse.subTitle}</p>
                     <div className="flex items-center justify-between mt-3">

       {/* Rating */}
         <div className="text-yellow-500 font-medium flex gap-2">
         <span className="flex items-center gap-1">
          <FaStar/>
          {avgRating}
          </span>

        <span className="text-gray-400">
        ({selectedCourse?.reviews?.length || 0} Reviews)
        </span>
         </div>

         {/* Price */}
       <div>
          <span className="text-xl font-semibold text-black">
           ₹{selectedCourse?.price}
         </span>
          <span className="line-through text-sm text-gray-400 ml-2"> ₹599</span>
         </div>
       </div>
            {/* Rating UI */}
            <div className="flex items-center gap-2 mt-3">
              {[1,2,3,4,5].map((star)=>(
                <FaStar
                  key={star}
                  size={22}
                  className={`cursor-pointer ${
                    (hover||rating)>=star
                      ?"text-yellow-400"
                      :"text-gray-300"
                  }`}
                  onClick={()=>setRating(star)}
                  onMouseEnter={()=>setHover(star)}
                  onMouseLeave={()=>setHover(null)}
                />
              ))}
              <button
                onClick={handleRatingSubmit}
                className="ml-3 bg-black text-white px-3 py-1 rounded text-sm" >Submit Rating</button>

              <textarea onChange={(e)=>setComment(e.target.value)} value={comment} className="w-full border border-gray-300 rounded-lg p-2 "
                placeholder="Write your review here..."
                rows={3}
                />

              <button
                className=" bg-black text-white mt-3 px-4 py-2 rounded hover:bg-gray-800" disabled={loading} onClick={handleReview}>{loading? <ClipLoader size={30} color='white'/>:"Submit Review"}</button>
            </div>

            {!isEnrolled?(
              <button
                className="bg-black text-white px-6 py-2 rounded mt-4"
                onClick={handleEnroll}
              >
                Enroll Now
              </button>
            ):(
              <button
                className="bg-green-100 text-green-600 px-6 py-2 rounded mt-4"
                onClick={()=>navigate(`/viewlecture/${courseId}`)}
              >
                Watch Now
              </button>
            )}

          </div>
        </div>

        {/* Lecture Section */}
        <div className="flex flex-col md:flex-row gap-6">

          <div className="w-full md:w-2/5 p-6 rounded-xl shadow border">
            {selectedCourse.lectures?.map((lecture,index)=>(
              <button
                key={index}
                disabled={!lecture.isPreviewFree}
                onClick={()=>lecture.isPreviewFree&&setSelectedLecture(lecture)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg border w-full mb-2"
              >
                {lecture.isPreviewFree?<FaPlayCircle/>:<FaLock/>}
                {lecture.lectureTitle}
              </button>
            ))}
          </div>

          <div className="w-full md:w-3/5 p-6 rounded-xl shadow border">
            {selectedLecture?.videoUrl?(
              <video
                className="w-full"
                src={selectedLecture.videoUrl}
                controls
              />
            ):(
              <span>Select a preview lecture to watch</span>
            )}
          </div>

        </div>

        {/* Creator Section */}
        <div className="flex items-center gap-4 pt-4 border-t">
          <img
            src={creatorData?.photoUrl||img}
            className="w-16 h-16 rounded-full"
            alt="creator"
          />
          <div>
            <h2 className="text-lg font-semibold">{creatorData?.name}</h2>
            <p className="text-sm">{creatorData?.email}</p>
          </div>
        </div>

        {/* Creator Courses */}
        <div className="flex flex-wrap gap-6">
          {creatorCourses?.map((course,index)=>(
            <Card
              key={index}
              thumbnail={course.thumbnail}
              id={course._id}
              price={course.price}
              title={course.title}
              category={course.category}
            />
          ))}
        </div>

      </div>
    </div>
  );
}

export default ViewCourse;