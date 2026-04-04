import React, {  useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../../App";
import { setLectureData } from "../../redux/lectureSlice";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

function EditLecture() {
  const { courseId, lectureId }=useParams();
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const { lectureData }=useSelector((state)=>state.lecture);

  const selectedLecture=lectureData?.find(lecture=>
    lecture._id===lectureId
  );

  const [lectureTitle,setLectureTitle]=useState(selectedLecture.lectureTitle);
  const [videoUrl,setVideoUrl]=useState(null);
  const [isPreviewFree, setIsPreviewFree]=useState(false);
  const [loading, setLoading]=useState(false);
  const [removeLoading,setRemoveLoading]=useState(false);

  const handleEditLecture=async()=>{
    if(!lectureTitle.trim()){
      toast.error("Lecture title is required");
      return;
    }
    if(!videoUrl){
      return toast.error("Please select a video file first");
    }
  setLoading(true);
  try {
    let responseData=null;
    if(videoUrl.size < 50 * 1024 * 1024){
      const formData=new FormData();
      formData.append("lectureTitle", lectureTitle);
      formData.append("videoUrl", videoUrl);
      formData.append("isPreviewFree", isPreviewFree);
      const result = await axios.post(`${serverUrl}/api/course/editlecture/${lectureId}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
      responseData=result.data.lecture;
    } else{
      const formData=new FormData();
      formData.append("file", videoUrl);
      formData.append("upload_preset", "my_preset"); 
      formData.append("resource_type", "video");
      const uploadRes=await axios.post(`https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/video/upload`,
        formData,
        {
          timeout:1000 * 60 * 30
        }
      );
      const finalVideoUrl=uploadRes.data.secure_url;
      const saveRes=await axios.post(`${serverUrl}/api/course/editlecture/${lectureId}`,
        {
          lectureTitle,
          videoUrl:finalVideoUrl,
          isPreviewFree
        },
        { withCredentials: true }
      );
      responseData=saveRes.data.lecture;
    }
    const updatedLectures=lectureData.map((lec)=>lec._id === lectureId ? responseData : lec);
    dispatch(setLectureData(updatedLectures));
    toast.success("Lecture updated successfully");
    navigate(`/createlecture/${courseId}`);
  } catch(error){
    console.log(error);
    toast.error("Upload failed");
  }
  setLoading(false);
 };
  
 
  const removeLecture=async()=>{
    setRemoveLoading(true);
    try {
      await axios.delete(`${serverUrl}/api/course/removelecture/${lectureId}`,{ withCredentials: true });
      setRemoveLoading(false); 
  
      toast.success("Lecture removed");
      navigate(`/createlecture/${courseId}`);
    } catch (error) {
      setRemoveLoading(false);
      toast.error(error?.response?.data?.message || "Delete failed");
    } 
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6 space-y-6">
        {/* HEADER */}
        <div className="flex items-center gap-2">
          <FaArrowLeftLong className="text-gray-600 cursor-pointer" onClick={() => navigate(`/createlecture/${courseId}`)}/>
          <h2 className="text-xl font-semibold text-gray-800"> Update Course Lecture</h2>
        </div>
        {/* REMOVE */}
        <button onClick={removeLecture} disabled={removeLoading} className=" mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all text-sm"
        >
          {removeLoading ? (
            <ClipLoader size={18} color="white" />
          ) : (
            "Remove Lecture"
          )}
        </button>

        {/* FORM */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">LectureTitle * </label>
            <input
              type="text"
              value={lectureTitle} 
              onChange={(e) => setLectureTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[black] focus:outline-none" required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor=""> Video * </label>
            <input
              type="file"
              accept="video/*"
                   onChange={(e) => {const file = e.target.files[0];
                    if(!file){
                     console.log("NO FILE");
                     return;
                   }
                  console.log("FILE SELECTED:", file);
                  setVideoUrl(file);
               }}
              className="w-full border border-gray-300  rounded-md p-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-gray-700 file:text-[white] hover:file:bg-gray-500" required
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isPreviewFree}
              onChange={() => setIsPreviewFree(prev=>!prev)} 
              className="accent-[black] h-4 w-4"
            />
            <label htmlFor="isFree" className="text-sm text-gray-700">Is this video FREE</label>
          </div>
          {loading && (
            <p className="text-sm text-gray-500"> Uploading vide... please wait.</p>
          )}
        </div>
        {/* SUBMIT */}
        <button
          onClick={handleEditLecture}
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-md text-sm font-medium hover:bg-gray-700 transition"
        >
          {loading ? (
            <ClipLoader size={20} color="white" />
          ) : (
            "Update Lecture"
          )}
        </button>
      </div>
    </div>
  );
}

export default EditLecture;
