import axios from "axios";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
const serverURL = import.meta.env.VITE_SERVER_URL;

const useUpdateLocation = () => {
    const {userData}= useSelector(state=>state.user);
  useEffect(() => {
    const updateLocation = async (lat, lon) => {
      try {
        const result = await axios.post(
          `${serverURL}/api/user/updateuserlocation`,
          { lat, lon },
          { withCredentials: true },
        );
      } catch (error) {
        console.log(error);
      }
    };
    navigator.geolocation.watchPosition(pos=>{
    updateLocation(pos.coords.latitude,pos.coords.longitude);
  })
  }, [userData]);

  
};

export default useUpdateLocation;
