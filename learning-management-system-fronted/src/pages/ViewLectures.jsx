import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { serverUrl } from '../App'
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaPlayCircle } from "react-icons/fa";

function ViewLecture() {

  const { courseId }=useParams()
  const { courseData }=useSelector(state=>state.course)
  const { userData }=useSelector(state=>state.user)
  const [creatorData,setCreatorData]=useState(null)
  const [selectedLecture,setSelectedLecture]=useState(null)
  const navigate=useNavigate()
  const selectedCourse=courseData?.find((course)=>course._id === courseId)

  useEffect(()=>{
    if(selectedCourse?.lectures?.length > 0){
      setSelectedLecture(selectedCourse.lectures[0])
    }
  }, [selectedCourse])

  useEffect(()=>{
    const handleCreator=async()=>{
      if(selectedCourse?.creator){
        try{
          const result=await axios.post(serverUrl + "/api/course/creator",{ userId: selectedCourse.creator },{ withCredentials: true })
          setCreatorData(result.data)
        } catch (error) {
          console.log(error)
        }
      }
    }
    handleCreator()
  }, [selectedCourse])

  if(!selectedCourse){
    return <div className='text-center mt-10'>Loading course...</div>
  }

  const isEnrolled=userData?.enrolledCourses?.some(
    (c)=>(typeof c === "string" ? c : c._id)===courseId
  )

  return (
    <div className='min-h-screen bg-gray-50 p-6 flex flex-col md:flex-row gap-6'>
      {/* LEFT SECTION */}
      <div className='w-full md:w-2/3 bg-white rounded-2xl shadow-md p-6 border border-gray-200'>
        <div className='mb-6'>
          <h2 className='text-2xl font-bold flex items-center gap-4 text-gray-800'>
            <FaArrowLeftLong className='cursor-pointer' onClick={() => navigate("/")} />
            {selectedCourse?.title}
          </h2>
          <div className='mt-2 flex gap-4 text-sm text-gray-500 font-medium'>
            <span>Category: {selectedCourse?.category}</span>
            <span>Level: {selectedCourse?.level}</span>
          </div>
        </div>

        {/* 🎥 VIDEO PLAYER */}
        <div className='aspect-video bg-black rounded-xl overflow-hidden mb-4 border border-gray-300'>
          {selectedLecture?.videoUrl && isEnrolled ? 
            <video className='w-full h-full object-cover' src={selectedLecture?.videoUrl} controls />
           : 
            <div className='flex items-center justify-center h-full text-white'> {isEnrolled ? "Select a lecture to start watching" : "Enroll to watch this course"} </div>
          }
        </div>
       <div className='mt-2'>
         <h2 className='text-xl font-semibold text-gray-800'>{selectedLecture?.lectureTitle}</h2>
       </div>
      </div>
      {/* RIGHT SECTION */}
      <div className='w-full md:w-1/3 bg-white rounded-2xl shadow-md p-6 border h-fit'>
        <h2 className='text-xl font-bold mb-4 text-gray-800'>All Lectures </h2>
        <div className='flex flex-col gap-3 mb-6'>
          {selectedCourse?.lectures?.length > 0 ? (
            selectedCourse.lectures.map((lecture,index)=>(
              <button
                key={index}
                onClick={()=>setSelectedLecture(lecture)}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  selectedLecture?._id === lecture._id
                    ? 'bg-gray-200 border-gray-500'
                    : 'hover:bg-gray-50 border-gray-300'
                }`}
              >
                <h2 className='text-sm font-semibold'>{lecture.lectureTitle}</h2>
                <FaPlayCircle />
              </button>
            ))
          ) : (
            <p className='text-gray-500'>No lectures available.</p>
          )}
        </div>

        {/* 👨‍🏫 CREATOR */}
        {creatorData && (
          <div className='border-t pt-4'>
            <h3 className='font-semibold mb-3'>Educator</h3>
            <div className='flex items-center gap-4'>
              <img src={creatorData?.photoUrl} className='w-14 h-14 rounded-full object-cover' alt="" />
              <div>
                <h2 className='text-base font-medium text-gray-800'>{creatorData?.name}</h2>
                <p className='text-sm text-gray-600'> {creatorData?.description} </p>
                <p className='text-sm text-gray-600'>{creatorData?.email}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ViewLecture