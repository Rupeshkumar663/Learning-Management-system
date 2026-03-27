import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCreatorCourseData } from "../redux/courseSlice";
import { serverUrl } from "../App";

const useCreatorCourse = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const result = await axios.get(
          serverUrl + "/api/course/getcreator",
          { withCredentials: true }
        );

        console.log(result.data);
        dispatch(setCreatorCourseData(result.data));
      } catch (error) {
        console.log(error);
      }
    };

    fetchCourses();
  }, [dispatch]);
};

export default useCreatorCourse;
