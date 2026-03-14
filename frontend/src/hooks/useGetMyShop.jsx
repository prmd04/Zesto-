import React,{useEffect} from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setMyShopData } from '../redux/ownerSlice';


const useGetCurrentUser = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUser = async()=>{
      try {
        const response = await axios.get('http://localhost:8000/api/shop/getmyshop' , {withCredentials:true})
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