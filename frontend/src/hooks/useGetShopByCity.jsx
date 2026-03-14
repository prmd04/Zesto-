import React,{useEffect} from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import {setShopInMyCity} from '../redux/userSlice';
const serverURL = import.meta.env.VITE_SERVER_URL;


const useGetShopByCity = () => {
  const dispatch = useDispatch();
  const {currentCity} = useSelector(state=>state.user);
  
  useEffect(() => {
    const getShop = async()=>{
      try {
        const response = await axios.get(`${serverURL}/api/shop/getshopbycity/${currentCity}` , {withCredentials:true})
        dispatch(setShopInMyCity(response.data));

        // console.log(response.data)
      } catch (error) {

        console.log(error.message)
      }
    }
    getShop();
  }, [currentCity,dispatch])
  
}

export default useGetShopByCity;