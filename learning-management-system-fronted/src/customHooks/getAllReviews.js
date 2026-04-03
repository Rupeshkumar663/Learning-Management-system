import {useEffect} from "react";
import axios from "axios";
import {useDispatch} from "react-redux";
import {serverUrl} from "../App";
import {setreviewData} from "../redux/reviewSlice";

export const useGetAllReviews=()=>{
  const dispatch=useDispatch();
  useEffect(()=>{
    const allReviews=async()=>{
      try{
        const result=await axios.get(serverUrl+"/api/review/getreview",{withCredentials:true});
        dispatch(setreviewData(result.data));
      }catch(error){
        console.log(error);
      }
    };
    allReviews();
  },[dispatch]);

};

