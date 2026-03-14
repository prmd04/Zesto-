import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { currentCity, currentState, currentAddress } from "../redux/userSlice";
import { setAddress, setLocation } from "../redux/mapSlice";


const useGetCity = () => {
  const APIKEY = import.meta.env.VITE_GEOAPIKEY;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!APIKEY) {
      console.error("Geoapify API key missing");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitude = Number(position.coords.latitude.toFixed(5));
          const longitude = Number(position.coords.longitude.toFixed(5));

          dispatch(setLocation({ long: longitude, lat: latitude }));

          const result = await axios.get(
            `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${APIKEY}`,
          );
          const features = result?.data?.results[0];

          if (!features || features.length === 0) {
            console.warn("No address found for these coordinates");
            return;
          }

          const properties = result.data.results[0];

          dispatch(currentCity(properties?.city || ""));
          dispatch(currentState(properties?.state || ""));
          dispatch(
            currentAddress(
              properties?.address_line1 || properties?.address_line2 || "",
            ),
          );

          dispatch(setAddress(properties?.address_line2 || ""));
        } catch (error) {
          console.error(
            "Reverse geocoding failed:",
            error.response?.data || error.message,
          );
        }
      },
      (error) => {
        console.error("Geolocation error:", error.message);
      },
    );
  }, [APIKEY, dispatch]);
};

export default useGetCity;
