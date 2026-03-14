import React,{useEffect} from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setMyShopData } from '../redux/ownerSlice';
const serverURL = import.meta.env.VITE_SERVER_URL;


const useGetCurrentUser = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUser = async()=>{
      try {
        const response = await axios.get(`${serverURL}/api/shop/getmyshop` , {withCredentials:true})
        dispatch(setMyShopData(response.data));

        // console.log(response.data)
      } catch (error) {
        console.log(error.message)
      }
    }
    fetchUser();
  }, [dispatch])
  
}

export default useGetCurrentUser;