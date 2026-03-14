import React,{useEffect} from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setMyOrders } from '../redux/userSlice';
const serverURL = import.meta.env.VITE_SERVER_URL;



const useGetMyOrders = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${serverURL}/api/order/getmyorders`,
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