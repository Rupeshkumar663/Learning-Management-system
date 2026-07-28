import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";

function MyEnrolledCourses() {
  const { userData }=useSelector((state)=>state.user);
  const navigate=useNavigate();
  const dispatch=useDispatch();

  useEffect(()=>{
    if (!userData?._id) return;
    const fetchUser=async()=>{
      try{
        const res=await axios.post(`${serverUrl}/api/course/creator`,{ userId: userData._id },{ withCredentials: true });
        dispatch(setUserData(res.data));
      } catch(error){
        console.log(error.response?.data || error.message);
      }
    };
    fetchUser();
  },[userData?._id]);

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <button onClick={()=>navigate("/")} className="w-11 h-11 rounded-full bg-white shadow-md hover:shadow-lg hover:bg-gray-100 flex items-center justify-center transition"><FaArrowLeftLong size={18} /></button>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 mt-4 mb-10">My Enrolled Courses</h1>
        {userData?.enrolledCourses?.length === 0 ? (
          <div className="flex justify-center items-center h-[55vh]">
            <p className="text-lg text-gray-500">You haven't enrolled in any course yet.</p></div>
        ):(
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 place-items-center">
            {userData?.enrolledCourses?.map((course,index)=>(
              <div
                key={course?._id || index}
                className="w-full max-w-[360px] bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col"
              >
                <img
                  src={course?.thumbnail ? course.thumbnail : "https://dummyimage.com/600x350/cccccc/000000&text=No+Image"}
                  alt={course?.title} className="w-full h-56 object-cover"
                  onError={(e)=>{e.target.src="https://dummyimage.com/600x350/cccccc/000000&text=No+Image";}}
                />
                <div className="flex flex-col flex-1 p-6">
                  <h2 className="text-3xl font-bold text-gray-900 line-clamp-2">{course?.title}</h2>
                  <p className="mt-3 text-lg text-gray-600">{course?.category}</p>
                  <span className="mt-4 inline-flex w-fit rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">{course?.level}</span>

                  <button onClick={()=>navigate(`/viewlecture/${course._id}`)} className="mt-auto w-full bg-black text-white py-3 rounded-xl font-semibold text-lg hover:bg-gray-800 transition mt-8"> Watch Now</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyEnrolledCourses;