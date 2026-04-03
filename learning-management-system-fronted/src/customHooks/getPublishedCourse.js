import {useEffect} from "react";
import axios from "axios";
import {serverUrl} from "../App";
import {useDispatch} from "react-redux";
import {setCourseData} from "../redux/courseSlice";

 export const useGetPublishedCourse=()=>{
  const dispatch=useDispatch();
  useEffect(()=>{
    const getCourseData=async()=>{
      try{
        const result=await axios.get(serverUrl +"/api/course/getpublished",{withCredentials:true});
        dispatch(setCourseData(result.data));
      }catch(error){
        console.log(error);
      }
    };
    getCourseData();
  },[dispatch]);

};

