import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  IndianRupee,
  MapPin,
  CreditCard,
  Navigation,
  Home,
  Search,
  Bike,
  Smartphone,
  ShieldCheck,
  ReceiptText,
  Info,
  Truck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { setAddress, setLocation } from "../redux/mapSlice";
import axios, { Axios } from "axios";
import Loader from "../components/Loader";
import { addNewOrder } from "../redux/userSlice";
import { incrementPendingOrders} from "../redux/ownerSlice";
const serverURL = import.meta.env.VITE_SERVER_URL;

/* Leaflet marker fix */
let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function ChangeView({ location }) {
  const map = useMap();

  useEffect(() => {
    if (location?.lat && location?.long) {
      map.setView([location.lat, location.long], 16, { animate: true });
    }
  }, [location, map]);

  return null;
}

function CheckOut() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userData);
  const userData = useSelector((state) => state.user.userData);
  const totalAmount = useSelector((state) => state.user.totalAmount);
  const location = useSelector((state) => state.map.location);
  const address = useSelector((state) => state.map.address);
  const cartItems = useSelector((state) => state.user.cartItems);
  const [loading, setLoading] = useState(false);
  const [searchAddress, setSearchAddress] = useState(address);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const numericTotal = Number(totalAmount) || 0;
  const deliveryFee = numericTotal > 500 ? 0 : 40;
  const amountWithDeliveryFee = totalAmount + deliveryFee;

  const APIKEY = import.meta.env.VITE_GEOAPIKEY;
  const RZPKEY = import.meta.env.VITE_RAZORPAY_API_KEY;

  const defaultPos = [location?.lat || 18.581603, location?.long || 73.986179];

  async function getAddressByLongAndLat(lat, long) {
    try {
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${long}&apiKey=${APIKEY}`,
      );
      const addr = result?.data?.features[0]?.properties?.address_line2;
      dispatch(setAddress(addr));
      setSearchAddress(addr);
    } catch (error) {
      console.log(error);
    }
  }
  function currentLocation() {
    // Check if the user object and location exist in your Redux state
    if (userData?.location?.coordinates) {
      const longitude = userData.location.coordinates[0];
      const latitude = userData.location.coordinates[1];

      dispatch(setLocation({ lat: latitude, long: longitude }));
      getAddressByLongAndLat(latitude, longitude);
    } else {
      // Optional: Fallback to Browser Geolocation if Redux has no saved location
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        dispatch(setLocation({ lat: latitude, long: longitude }));
        getAddressByLongAndLat(latitude, longitude);
      });
    }
  } // Removed the extra } that was here

  async function getLatandLangByAddress() {
    try {
      const response = await axios.get(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
          searchAddress,
        )}&apiKey=${APIKEY}`,
      );
      const { lat, lon } = response.data.features[0].properties;
      dispatch(setLocation({ lat, long: lon }));
    } catch (error) {
      console.log(error);
    }
  }

  const placeOrder = async () => {
    // console.log("RZP Key:", RZPKEY); // Should show rzp_test_...

    setLoading(true);
    try {
      const response = await axios.post(
        `${serverURL}/api/order/placeorder`,
        {
          paymentMethod,
          deliveryAddress: {
            text: searchAddress,
            latitude: location.lat,
            longitude: location.long,
          },
          totalAmount,
          cartItems,
        },
        { withCredentials: true },
      );

      if (paymentMethod === "cod") {
        setLoading(false);
        dispatch(addNewOrder(response.data));
        dispatch(incrementPendingOrders());
        navigate("/orderPlaced");
      } else {
        const orderId = response.data.orderId;
        const razorOrder = response.data.razorpayOrder;
        openRazorpayWindow(orderId, razorOrder);
      }
    } catch (error) {
      setLoading(false);
      console.log(error.response?.status);
      console.log(error.response?.data);
    }
  };

  const openRazorpayWindow = (orderId, razorOrder) => {
  //   console.log("RZP Key:", RZPKEY); // Should show rzp_test_...
  // console.log("Razor Order Object:", razorOrder);
    const options = {
      key: RZPKEY,
      amount: razorOrder.amount,
      currency: "INR",
      name: "Zesto",
      description: "Food Delivery Website",
      order_id: razorOrder.id,
      handler: async (razorResponse) => {
        try {
          const response= await axios.post(
            `${serverURL}/api/order/verifypayement`,
            {
              razorpay_payment_id: razorResponse.razorpay_payment_id,
              orderId,
            },
            { withCredentials: true },
          );

          setLoading(false);
          dispatch(addNewOrder(response.data.order));
          dispatch(incrementPendingOrders());
          navigate("/orderPlaced");
        } catch (error) {
          console.log(error);
        }
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  useEffect(() => {
    setSearchAddress(address);
  }, [address]);

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="min-h-screen bg-[#fff9f6] flex flex-col items-center px-3 py-2 text-[15px]">
      {/* Header */}
      <div className="w-full max-w-3xl flex items-center gap-4 mb-6">
        <div
          className="cursor-pointer hover:bg-white p-2 rounded-full shadow-sm border"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={22} className="text-[#ff4d2d]" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
      </div>

      <div className="w-full max-w-3xl space-y-6">
        {/* Delivery */}
        <div className="bg-white rounded-3xl border p-6 space-y-4">
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-[#ff4d2d]" />
            <h2 className="font-bold text-lg">Delivery Details</h2>
          </div>

          <div className="flex gap-3">
            <input
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              placeholder="Search for area, street name..."
              className="flex-1 px-4 py-3 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-[#ff4d2d]/30"
            />
            <button
              onClick={getLatandLangByAddress}
              className="px-5 bg-[#ff4d2d] text-white rounded-2xl"
            >
              <Search size={18} />
            </button>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-500">
              Set location
            </span>
            <button
              onClick={currentLocation}
              className="flex items-center gap-1 text-[#ff4d2d] text-sm font-bold cursor-pointer"
            >
              <Navigation size={14} /> Use Current GPS
            </button>
          </div>

          <div className="w-full h-72 rounded-2xl overflow-hidden border">
            <MapContainer
              center={defaultPos}
              zoom={16}
              className="w-full h-full"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <ChangeView location={location} />
              <Marker
                position={defaultPos}
                draggable
                eventHandlers={{
                  dragend: (e) => {
                    const { lat, lng } = e.target.getLatLng();
                    dispatch(setLocation({ lat, long: lng }));
                    getAddressByLongAndLat(lat, lng);
                  },
                }}
              />
            </MapContainer>
          </div>
        </div>

        {/* Payment Section */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg flex items-center gap-2 text-gray-800">
              <CreditCard size={20} className="text-[#ff4d2d]" />
              Payment Method
            </h2>
            <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full tracking-wider uppercase">
              <ShieldCheck size={12} /> Secure
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cash on Delivery */}
            <div
              onClick={() => setPaymentMethod("cod")}
              className={`relative p-5 rounded-2xl cursor-pointer border-2 transition-all duration-300 flex flex-col gap-3
      ${
        paymentMethod === "cod"
          ? "border-[#ff4d2d] bg-[#fff9f6] shadow-md shadow-[#ff4d2d]/10"
          : "border-gray-100 hover:border-gray-200 bg-white"
      }`}
            >
              <div className="flex justify-between items-start">
                <div
                  className={`p-2 rounded-xl transition-colors ${paymentMethod === "cod" ? "bg-[#ff4d2d] text-white" : "bg-gray-100 text-gray-400"}`}
                >
                  <Bike size={24} />
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === "cod" ? "border-[#ff4d2d] bg-[#ff4d2d]" : "border-gray-300"}`}
                >
                  {paymentMethod === "cod" && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
              </div>
              <div>
                <p
                  className={`font-bold ${paymentMethod === "cod" ? "text-gray-900" : "text-gray-500"}`}
                >
                  Cash on Delivery
                </p>
                <p className="text-xs text-gray-400 font-medium">
                  Pay at your doorstep
                </p>
              </div>
            </div>

            <div
              onClick={() => setPaymentMethod("online")}
              className={`relative p-5 rounded-2xl cursor-pointer border-2 transition-all duration-300 flex flex-col gap-3 overflow-hidden
      ${
        paymentMethod === "online"
          ? "border-[#ff4d2d] bg-[#fff9f6] shadow-md shadow-[#ff4d2d]/10"
          : "border-gray-100 hover:border-gray-200 bg-white"
      }`}
            >
              <div className="flex justify-between items-start">
                <div
                  className={`p-2 rounded-xl transition-colors ${paymentMethod === "online" ? "bg-[#ff4d2d] text-white" : "bg-gray-100 text-gray-400"}`}
                >
                  <Smartphone size={24} />
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === "online" ? "border-[#ff4d2d] bg-[#ff4d2d]" : "border-gray-300"}`}
                >
                  {paymentMethod === "online" && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
              </div>

              <div className="z-10">
                <p
                  className={`font-bold ${paymentMethod === "online" ? "text-gray-900" : "text-gray-500"}`}
                >
                  UPI / Credit / Debit Card
                </p>
                <div className="flex gap-1.5 mt-1">
                  {/* Visual card brand cues */}
                  <div className="h-3 w-5 bg-blue-600 rounded-xs opacity-80" />
                  <div className="h-3 w-5 bg-orange-500 rounded-xs opacity-80" />
                  <div className="h-3 w-5 bg-slate-800 rounded-xs opacity-80" />
                </div>
              </div>

              {/* Decorative background Credit Card icon for a "Working" feel */}
              <CreditCard
                size={70}
                className={`absolute -bottom-4 -right-4 rotate-12 transition-colors duration-500 ${
                  paymentMethod === "online"
                    ? "text-[#ff4d2d]/10"
                    : "text-gray-50"
                }`}
              />
            </div>
          </div>
        </div>
        {/* Bill Summary */}

        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <ReceiptText size={20} className="text-gray-400" />
              <h2 className="font-bold text-lg text-gray-800 tracking-tight">
                Bill Summary
              </h2>
            </div>
          </div>

          <div className="space-y-3">
            {/* Subtotal */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Item Total</span>
              <span className="text-gray-800 font-semibold">
                ₹{totalAmount?.toLocaleString("en-IN")}.00
              </span>
            </div>

            {/* Delivery Fee Logic */}
            <div className="flex justify-between text-sm">
              <div className="flex items-center gap-1.5">
                <span className="text-gray-500 font-medium">Delivery Fee</span>
                <Info size={12} className="text-gray-300 cursor-help" />
              </div>
              <div className="flex items-center gap-2">
                {deliveryFee === 0 ? (
                  <>
                    <span className="text-gray-300 line-through text-xs">
                      ₹40.00
                    </span>
                    <span className="text-green-600 font-bold uppercase text-xs tracking-wide">
                      Free
                    </span>
                  </>
                ) : (
                  <span className="text-gray-800 font-semibold">
                    ₹{deliveryFee}.00
                  </span>
                )}
              </div>
            </div>

            {/* Small Incentive Message */}
            {totalAmount <= 500 && (
              <div className="bg-blue-50 p-3 rounded-xl flex items-start gap-2 border border-blue-100">
                <Truck size={14} className="text-blue-500 mt-0.5" />
                <p className="text-[11px] text-blue-700 leading-tight">
                  Add <span className="font-bold">₹{501 - totalAmount}</span>{" "}
                  more to unlock{" "}
                  <span className="font-bold">FREE Delivery</span>
                </p>
              </div>
            )}
          </div>

          {/* Custom Dashed Separator */}
          <div className="border-t border-dashed border-gray-200 my-2" />

          {/* Total Amount Box */}
          <div className="bg-[#fff9f6] rounded-2xl p-4 flex justify-between items-center border border-[#ff4d2d]/10">
            <div>
              <p className="text-[10px] uppercase font-black text-[#ff4d2d]/60 tracking-widest">
                Grand Total
              </p>
              <p className="text-sm font-bold text-gray-700">To be paid</p>
            </div>
            <div className="flex items-center text-3xl font-black text-[#ff4d2d]">
              <IndianRupee size={24} strokeWidth={3} />
              <span>{amountWithDeliveryFee?.toLocaleString("en-IN")}.00</span>
            </div>
          </div>

          {/* Micro-copy */}
          <div className="flex items-center justify-center gap-1 opacity-50">
            <div className="h-1 w-1 bg-gray-400 rounded-full" />
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">
              Secure Checkout Guaranteed
            </p>
            <div className="h-1 w-1 bg-gray-400 rounded-full" />
          </div>
        </div>

        {/* Place Order */}
        <button
          onClick={placeOrder}
          disabled={!address}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition
            ${
              !address
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#ff4d2d] text-white hover:bg-[#e64429]"
            }`}
        >
          {paymentMethod === "cod" ? "Place Order" : "Pay And Place Order"}
        </button>
      </div>
    </div>
  );
}

export default CheckOut;
