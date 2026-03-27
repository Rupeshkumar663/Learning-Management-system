import React, { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { setLectureData } from "../redux/lectureSlice";
import { toast } from "react-toastify";
import { serverUrl } from "../App";

function CreateLecture() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const dispatch = useDispatch();

  const { lectureData } = useSelector((state) => state.lecture);

  const [lectureTitle, setLectureTitle] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= GET ALL LECTURES =================
  useEffect(() => {
    const getCourseLectures = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/course/courselecture/${courseId}`,
          { withCredentials: true }
        );
        dispatch(setLectureData(res.data.course.lectures));
      } catch (error) {
        console.log(error);
      }
    };
    getCourseLectures();
  }, [courseId, dispatch]);

  // ================= CREATE LECTURE =================
  const handleCreateLecture = async () => {
    if (!lectureTitle) {
      toast.error("Lecture title is required");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${serverUrl}/api/course/createlecture/${courseId}`,
        {
          title: lectureTitle, // ✅ FIX (lectureTitle -> title)
        },
        { withCredentials: true }
      );

      dispatch(setLectureData([...(lectureData || []), res.data.lecture]));
      toast.success("Lecture added");
      setLectureTitle("");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to add lecture"
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-2xl p-6">
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-1">
            Add Course Lectures
          </h1>
          <p className="text-sm text-gray-500">
            Enter lecture title and manage your course lectures
          </p>
        </div>

        {/* INPUT */}
        <input
          type="text"
          className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black mb-4"
          placeholder="e.g. Introduction to MERN Stack"
          value={lectureTitle}
          onChange={(e) => setLectureTitle(e.target.value)}
        />

        {/* BUTTONS */}
        <div className="flex gap-4 mb-6">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-sm font-medium"
            onClick={() => navigate(`/editcourse/${courseId}`)}
          >
            <FaArrowLeftLong /> Back to Course
          </button>

          <button
            className="px-5 py-2 rounded-md bg-black text-white hover:bg-gray-700 transition-all text-sm shadow"
            disabled={loading}
            onClick={handleCreateLecture}
          >
            {loading ? <ClipLoader size={18} color="white" /> : "+ Create Lecture"}
          </button>
        </div>

        {/* LECTURE LIST */}
        <div className="space-y-2">
          {lectureData?.length === 0 && (
            <p className="text-sm text-gray-500">No lectures added yet</p>
          )}

          {lectureData?.map((lecture, index) => (
            <div
              key={lecture._id}
              className="bg-gray-100 rounded-md flex justify-between items-center p-3 text-sm font-medium text-gray-700"
            >
              <span>
                Lecture {index + 1}: {lecture.title} {/* ✅ FIX */}
              </span>

              <FaEdit
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
                onClick={() =>
                  navigate(`/editlecture/${courseId}/${lecture._id}`)
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CreateLecture;
