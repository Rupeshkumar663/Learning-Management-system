import React, { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../../App";
import { setLectureData } from "../../redux/lectureSlice";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

function EditLecture() {
  const { courseId, lectureId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { lectureData } = useSelector((state) => state.lecture);

  const selectedLecture = lectureData?.find(
    (l) => l._id === lectureId
  );

  // ✅ FIX: never undefined
  const [lectureTitle, setLectureTitle] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [isPreviewFree, setIsPreviewFree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);

  // ✅ FIX: correct field name + fallback
  useEffect(() => {
    if (selectedLecture) {
      setLectureTitle(selectedLecture.title || "");
      setIsPreviewFree(selectedLecture.isPreviewFree || false);
    }
  }, [selectedLecture]);

  // UPDATE LECTURE
  const handleEditLecture = async () => {
    if (!lectureTitle.trim()) {
      toast.error("Lecture title is required");
      return;
    }

    const formData = new FormData();
    formData.append("lectureTitle", lectureTitle);
    formData.append("isPreviewFree", String(isPreviewFree)); // ✅ safe
    if (videoFile) formData.append("video", videoFile); // ✅ correct key

    setLoading(true);
    try {
      const res = await axios.post(
        `${serverUrl}/api/course/editlecture/${lectureId}`,
        formData,
        { withCredentials: true }
      );

      // ✅ FIX: backend sends { lecture }
      dispatch(
        setLectureData(
          lectureData.map((l) =>
            l._id === lectureId ? res.data.lecture : l
          )
        )
      );

      toast.success("Lecture updated successfully");
      navigate(`/createlecture/${courseId}`);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // DELETE LECTURE
  const removeLecture = async () => {
    setRemoveLoading(true);
    try {
      await axios.delete(
        `${serverUrl}/api/course/removelecture/${lectureId}`,
        { withCredentials: true }
      );

      dispatch(
        setLectureData(
          lectureData.filter((l) => l._id !== lectureId)
        )
      );

      toast.success("Lecture removed");
      navigate(`/createlecture/${courseId}`);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Delete failed"
      );
    } finally {
      setRemoveLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6 space-y-6">
        {/* HEADER */}
        <div className="flex items-center gap-2">
          <FaArrowLeftLong
            className="text-gray-600 cursor-pointer"
            onClick={() => navigate(`/createlecture/${courseId}`)}
          />
          <h2 className="text-xl font-semibold text-gray-800">
            Update Course Lecture
          </h2>
        </div>

        {/* REMOVE */}
        <button
          onClick={removeLecture}
          disabled={removeLoading}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lecture Title *
            </label>
            <input
              type="text"
              value={lectureTitle} // ✅ always controlled
              onChange={(e) => setLectureTitle(e.target.value)}
              className="w-full p-3 border rounded-md text-sm focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Video (optional)
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0])}
              className="w-full border rounded-md p-2"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isPreviewFree}
              onChange={(e) => setIsPreviewFree(e.target.checked)} // ✅ FIX
              className="accent-black h-4 w-4"
            />
            <label className="text-sm text-gray-700">
              Is this video FREE
            </label>
          </div>

          {loading && (
            <p className="text-sm text-gray-500">
              Uploading video… please wait
            </p>
          )}
        </div>

        {/* SUBMIT */}
        <button
          onClick={handleEditLecture}
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-700"
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
