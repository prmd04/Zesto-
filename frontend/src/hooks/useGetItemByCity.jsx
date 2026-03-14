import React,{useEffect} from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setItemInMyCity } from '../redux/userSlice';
const serverURL = import.meta.env.VITE_SERVER_URL;


const useGetItemByCity = () => {
  const dispatch = useDispatch();
  const {currentCity} = useSelector(state=>state.user);
  
  useEffect(() => {
    const getItem = async()=>{
      try {
        const response = await axios.get(`${serverURL}/api/item/getitembycity/${currentCity}` , {withCredentials:true})
        dispatch(setItemInMyCity(response.data));

        // console.log(response.data)
      } catch (error) {

        console.log(error.message)
      }
    }
    getItem();
  }, [currentCity,dispatch])
  
}

export default useGetItemByCity;