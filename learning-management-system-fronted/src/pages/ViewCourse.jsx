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
import ReviewCard from "../component/ReviewCard";

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
  const [hover,setHover]=useState(null);
  const [comment,setComment]=useState("");
  const [loading,setloading]=useState(false);

  useEffect(()=>{
    if(selectedCourse){
      console.log("Lectures:",selectedCourse.lectures);
      console.log("Reviews:",selectedCourse.reviews);
    }
   },[selectedCourse]);

  useEffect(()=>{
  const fetchCourse=async()=>{
    try {
      const res=await axios.get(`${serverUrl}/api/course/getcourse/${courseId}`,{ withCredentials: true });
      dispatch(setSelectedCourse(res.data));
      if(res.data.lectures?.length > 0) {
        const firstFreeLecture=res.data.lectures.find(l => l.isPreviewFree) || res.data.lectures[0];
        setSelectedLecture(firstFreeLecture);
      }
    } catch (error) {
      console.log(error);
    }
  };
  fetchCourse();
}, [courseId]);

  useEffect(()=>{
    const handleCreator=async()=>{
      if(selectedCourse?.creator){
        try{
          const res=await axios.post(serverUrl+"/api/course/creator",{userId:selectedCourse?.creator},{withCredentials:true});
          setCreatorData(res.data);
        }catch(err){
          console.log(err);
        }
      }
    };
    handleCreator();
  },[selectedCourse]);

  useEffect(()=>{
    const verify=userData?.enrolledCourses?.some(c=>(
      typeof c==='string'?c:c._id).toString()===courseId?.toString()
    );
    if(verify) 
      setIsEnrolled(true);
  },[courseId,userData]);

  useEffect(()=>{
    if(creatorData?._id&&courseData?.length>0){
      const courses=courseData.filter(
        (course)=>
          course.creator===creatorData?._id&&
          course._id!==courseId
      );
      setCreatorCourses(courses);
    }
  },[creatorData,courseData,courseId]);

  const handleEnroll=async()=>{
    try{
      const orderData=await axios.post(serverUrl+"/api/order/razorpay-order",{userId:userData?._id,courseId},{withCredentials:true});
      const options={
        key:import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount:orderData.data.amount,
        currency:"INR",
        name:"VIRTUAL COURSES",
        description:"COURSE ENROLLMENT PAYMENT",
        order_id:orderData.data.id,
        handler:async function(response){
          try{
            const verify=await axios.post( serverUrl+"/api/order/verifypayment",{...response,courseId,userId:userData?._id},{withCredentials:true});
            setIsEnrolled(true);
            toast.success(verify.data.message);
            window.location.reload();
          }catch(error){
            toast.error(error.response?.data?.message);
          }
        },
      };
      const rzp=new window.Razorpay(options);
      rzp.open();
    }catch(error){
      console.log(error);
      toast.error("Something went wrong while enrolling.");
    }
  };

  const handleReview=async()=>{
    if(!isEnrolled){
      return toast.error("Enroll first to rate this course");
    }
    if(rating===0){
      return toast.error("Please select a rating");
    }
    setloading(true);
    try{
      const result=await axios.post(serverUrl+"/api/review/createreview", {rating,comment,courseId}, {withCredentials:true});
      setloading(false);
      toast.success("Review Added");
      console.log(result.data);
      setRating(0);
      setComment("");
      window.location.reload();
    }catch(error){
      console.log(error);
      setloading(false);
      toast.error(error.response?.data?.message);
      setRating(0);
      setComment("");
    }
  };

  const calculateAvgReview=(reviews)=>{
    if(!reviews||reviews.length===0) return 0;
    const total=reviews.reduce((sum,review)=>{
      const r=Number(
        review.rating??
        review.Rating??
        review.stars??
        review.score??
        review.value??
        0
      );
      return sum+r;
    },0);
    const avg=total/reviews.length;
    return isNaN(avg)?0:avg.toFixed(0);
  };
   console.log("AVG DEBUG:",selectedCourse?.reviews);
  const avgRating=calculateAvgReview(selectedCourse?.reviews);
  const videoSrc=selectedLecture?.videoUrl || selectedLecture?.videoUrl?.url || null;
  if(!selectedCourse){
    return(
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return(
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6 relative">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2">
            <FaArrowLeftLong className="text-[black] w-[22px] h-[22px] cursor-pointer mb-3" onClick={()=>navigate("/")} />
            <img src={selectedCourse.thumbnail||img} alt="course" className="rounded-xl w-full" />
          </div>
          <div className="flex-1 space-y-2 mt-5">
            <h2 className="text-2xl font-bold">{selectedCourse.title}</h2>
            <p className="text-gray-600">{selectedCourse.subTitle}</p>
            <div className="flex items-start flex-col justify-between">
              {/* Rating Display */}
              <div className="text-yellow-500 font-medium flex gap-2">
                <span className="flex items-center justify-start gap-1"> <FaStar/>{avgRating}</span>
                <span className="text-gray-400">({selectedCourse?.reviews?.length||0} Reviews)</span>
              </div>
              {/* Price */}
              <div>
                <span className="text-xl font-semibold text-black">₹{selectedCourse?.price}</span>
                <span className="line-through text-sm text-gray-400 ml-2">₹599</span>
              </div>
              <ul className="text-sm text-gray-700 space-y-1 pt-2">
                <li>✅ 10+ hours of video content</li>
                <li>✅ Lifetime access to course materials</li>
              </ul>
              {!isEnrolled?(
                <button className="bg-[black] text-white px-6 py-2 rounded hover:bg-gray-700 mt-3 cursor-pointer" onClick={handleEnroll} > Enroll Now</button>
              ):(
                <button className="bg-green-100 text-green-500 px-6 py-2 rounded hover:bg-gray-700 mt-3 cursor-pointer" onClick={()=>navigate(`/viewlecture/${courseId}`)}>Watch Now</button>
              )}
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">what you'll learn</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Learn {selectedCourse?.category} from beginning</li>
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">who This Course is For</h2>
          <p className="text-gray-700">Beginners ,aspiring developers, and professionals looking to upgrade skills.</p>
        </div>
        {/* Lecture Section */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="bg-white w-full md:w-2/5 p-6 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-1 text-gray-800">Course CurriCulum</h2>
            <p className="text-sm text-gray-500 mb-4">{selectedCourse?.lectures?.length} Lectures</p>
            <div className="flex flex-col gap-3">
              {selectedCourse.lectures?.map((lecture,index)=>(
                <button
                  key={index}
                  disabled={!lecture.isPreviewFree && !isEnrolled}
                  onClick={()=>{
                    if(lecture.isPreviewFree || isEnrolled){
                      setSelectedLecture(lecture);
                    }
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200 text-left ${
                    (lecture.isPreviewFree || isEnrolled)
                      ?"hover:bg-gray-200 cursor-pointer border-gray-300"
                      :"cursor-not-allowed opacity-60 border-gray-200"
                  } ${selectedLecture?._id===lecture?._id?" bg-gray-100 border-gray-400":""}`}
                >
                  <span className="text-lg text-gray-700">{(lecture.isPreviewFree || isEnrolled)?<FaPlayCircle/>:<FaLock/>}</span>
                  <span className="text-sm font-medium text-gray-800">{lecture?.lectureTitle}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white w-full md:w-3/5 p-6 rounded-2xl shadow-lg border border-gray-200">
            <div className="aspect-video w-full rounded-lg overflow-hidden mb-4 bg-black flex items-center justify-center">
              {/* FIX 4: key prop forces remount + safe videoSrc */}
              {(isEnrolled || selectedLecture?.isPreviewFree) ? (videoSrc ? (
               <video
               key={selectedLecture?._id}
               className="w-full h-full object-cover"
               src={videoSrc}
               controls
               autoPlay
              />
             ):(<span className="text-white text-sm">No video available</span>)
             ):(
                <span className="text-white text-sm">{selectedLecture?"No video available for this lecture":"Select a preview lecture to watch"}</span>
              )}
            </div>
          </div>
        </div>
        {/* Review Section */}
        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold mb-2">write a Reviews</h2>
          <div className="mb-4">
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
            </div>
            <textarea
              onChange={(e)=>setComment(e.target.value)}
              value={comment}
              className="w-full border border-gray-300 rounded-lg p-2 mt-3"
              placeholder="Write your review here..."
              rows={3}
            />
            <button className="bg-black text-white mt-3 px-4 py-2 rounded hover:bg-gray-800" disabled={loading}  onClick={handleReview} > {loading?<ClipLoader size={30} color='white'/>:"Submit Review"}</button>
          </div>
        </div>

        {/* Creator Section */}
        <div className="flex items-center gap-4 pt-4 border-t">
          {creatorData?.photoUrl?(
            <img src={creatorData?.photoUrl} alt="creator" className="border-1 border-gray-200 w-16 h-16 rounded-full object-cover" />
          ):(
            <img src={img} alt="" className="border-1 border-gray-200 w-16 h-16 rounded-full object-cover" />
          )}
          <div>
            <h2 className="text-lg font-semibold">{creatorData?.name}</h2>
            <p className="md:text-sm text-gray-600 text-[10px]">{creatorData?.description}</p>
            <p className="md:text-sm text-gray-600 text-[10px]">{creatorData?.email}</p>
          </div>
        </div>

        <div>
          <p className="text-xl font-semibold mb-2">Other Published Courses by the Educator -</p>
        </div>
        <div className="w-full transition-all duration-300 py-[20px] flex items-start justify-center lg:justify-start flex-wrap gap-6 lg:px-[80px]">
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