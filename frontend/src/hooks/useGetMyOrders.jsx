import React,{useEffect} from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setMyOrders } from '../redux/userSlice';



const useGetMyOrders = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/order/getmyorders",
          { withCredentials: true }
        );

        dispatch(setMyOrders(response.data));
      } catch (error) {
        console.log(error.message);
      }
    };

    // Initial fetch
    fetchUser();

    // Poll every 5 seconds
    const interval = setInterval(() => {
      fetchUser();
    }, 15000);

    return () => clearInterval(interval);
  }, [dispatch]);
};

export default useGetMyOrders;