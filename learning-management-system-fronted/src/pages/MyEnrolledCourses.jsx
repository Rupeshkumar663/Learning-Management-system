import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";

function MyEnrolledCourses() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userData?._id) return;

    const fetchUser = async () => {
      try {
        const res = await axios.post(
          `${serverUrl}/api/course/creator`,
          { userId: userData._id },
          { withCredentials: true }
        );
        dispatch(setUserData(res.data));
      } catch (error) {
        console.log(error.response?.data || error.message);
      }
    };

    fetchUser();
  }, [userData?._id]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <button
          onClick={() => navigate("/")}
          className="w-11 h-11 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100 transition"
        >
          <FaArrowLeftLong size={18} />
        </button>

        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mt-4 mb-10">
          My Enrolled Courses
        </h1>

        {userData?.enrolledCourses?.length === 0 ? (
          <div className="flex justify-center items-center h-[50vh]">
            <p className="text-lg text-gray-500 text-center">
              You haven't enrolled in any course yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
            {userData?.enrolledCourses?.map((course, index) => (
              <div
                key={course?._id || index}
                className="w-full max-w-[330px] bg-white rounded-2xl overflow-hidden shadow-md border hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <img
                  src={
                    course?.thumbnail
                      ? course.thumbnail
                      : "https://dummyimage.com/600x350/cccccc/000000&text=No+Image"
                  }
                  alt={course?.title}
                  className="w-full h-52 object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://dummyimage.com/600x350/cccccc/000000&text=No+Image";
                  }}
                />

                <div className="p-5 flex flex-col">
                  <h2 className="text-2xl font-bold text-gray-800 line-clamp-2">
                    {course?.title}
                  </h2>

                  <p className="text-gray-600 mt-2">
                    {course?.category}
                  </p>

                  <span className="mt-3 inline-flex w-fit px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                    {course?.level}
                  </span>

                  <button
                    onClick={() => navigate(`/viewlecture/${course._id}`)}
                    className="mt-6 w-full py-3 rounded-xl bg-black text-white font-medium hover:bg-gray-800 transition"
                  >
                    Watch Now
                  </button>
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