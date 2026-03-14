import React,{useEffect} from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { logoutUser, setUserData } from '../redux/userSlice.js';
const serverURL = import.meta.env.VITE_SERVER_URL;

const useGetCurrentUser = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const fetchUser = async()=>{
      try {
        const response = await axios.get(`${serverURL}/api/user/current` , {withCredentials:true})
        dispatch(setUserData(response.data));

        // console.log(response.data)
      } catch (error) {
        dispatch(logoutUser());
      }
    }
    fetchUser();
  }, [dispatch])
  
}

export default useGetCurrentUser;