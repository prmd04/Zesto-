import React,{useEffect} from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { clearShopData, setMyShopData } from '../redux/ownerSlice.js';


const useGetCurrentShop = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const fetchUser = async()=>{
      try {
        const response = await axios.get('http://localhost:8000/api/shop/current' , {withCredentials:true})
        dispatch(setMyShopData(response.data));
      } catch (error) {
        dispatch(clearShopData());
        console.log(error.message)
      }
    }
    fetchUser();
  }, [dispatch])
  
}

export default useGetCurrentShop;