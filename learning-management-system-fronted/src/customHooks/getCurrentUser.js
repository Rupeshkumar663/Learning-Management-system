import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setUserData } from "../redux/userSlice"
import { serverUrl } from "../App"

const useCurrentUser = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/getcurrentuser`, {
          withCredentials: true  
        })
        
        dispatch(setUserData(result.data.user)) 

      } catch (error) {
        console.log("User not logged in", error.response?.data);
      }
    }

    fetchUser()
  }, [dispatch])
}

export default useCurrentUser
