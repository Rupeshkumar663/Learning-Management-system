import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeftLong } from "react-icons/fa6";
import axios from "axios"
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";

function MyEnrolledCourses(){
  const { userData }=useSelector(state=>state.user)
  const navigate=useNavigate()
  const dispatch=useDispatch();

  useEffect(()=>{
  if(!userData?._id) 
    return; 
  const fetchUser=async()=>{
    try{
      const res=await axios.post(`${serverUrl}/api/course/creator`,{ userId: userData._id },{ withCredentials: true });
      dispatch(setUserData(res.data));
    } catch(error) {
      console.log(error.response?.data || error.message);
    }
  };

  fetchUser();
},[userData?._id]);
  return (
    <div className='min-h-screen w-full px-4 py-9 bg-gray-50'>
      <FaArrowLeftLong
        className='absolute top-[3%] md:top-[6%] left-[5%] w-[22px] h-[22px] cursor-pointer'
        onClick={()=>navigate("/")}
      />
      <h1 className='text-3xl text-center font-bold text-gray-800 mb-6'>My Enrolled Courses</h1>
      {
        userData?.enrolledCourses?.length === 0 ? (
          <p className='text-gray-500 text-center w-full'> you haven't enrolled in any course yet.</p>
        ) : (
          <div className='flex items-center justify-center flex-wrap gap-[30px]'>
            {
              userData?.enrolledCourses?.map((course,index)=>(
                <div
                  key={course?._id || index}
                  className='bg-white rounded-2xl shadow-md overflow-hidden border '
                >
                  <img src={course?.thumbnail ? course.thumbnail:"https://dummyimage.com/300x150/cccccc/000000&text=No+Image"} alt="course" className='w-full h-40 object-cover' onError={(e)=>{e.target.src="https://dummyimage.com/300x150/cccccc/000000&text=No+Image";}}/>
                  <div className='p-4'>
                    <h2 className='text-lg font-semibold text-gray-800'>{course?.title}</h2>
                    <p className='text-sm text-gray-600 mb-2'>{course?.category}</p>
                    <p className='text-sm text-gray-600 mb-2'>{course?.level}</p>
                    <h1
                      className="px-[10px] text-center py-[10px] border-2 bg-black border-black text-white rounded-[10px] text-[15px] font-light cursor-pointer mt-[10px] hover:bg-gray-600" onClick={()=>navigate(`/viewlecture/${course._id}`)}
                    >Watch Now</h1>
                  </div>
                </div>
              ))
            }
          </div>
        )
      }
    </div>
  )
}

export default MyEnrolledCourses;