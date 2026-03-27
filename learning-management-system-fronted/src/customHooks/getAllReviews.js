import {useEffect} from "react";
import axios from "axios";
import {useDispatch} from "react-redux";
import {serverUrl} from "../App";
import {setreviewData} from "../redux/reviewSlice";

const useGetAllReviews=()=>{

  const dispatch=useDispatch();

  useEffect(()=>{
    const allReviews=async()=>{
      try{
        const result=await axios.get(
          serverUrl+"/api/review/getreview",
          {withCredentials:true}
        );
        dispatch(setreviewData(result.data));
        console.log(result.data);
      }catch(error){
        console.log(error);
      }
    };

    allReviews();
  },[dispatch]);

};

export default useGetAllReviews;