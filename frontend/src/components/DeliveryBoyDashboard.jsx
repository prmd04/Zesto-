import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import axios from "axios";
import { MapPin, Package, IndianRupee, CheckCircleIcon } from "lucide-react";
import DeliveryBoyTracking from "./DeliveryBoyTracking";
import toast, { Toaster } from "react-hot-toast";

const DeliveryBoyDashboard = () => {
  const userData = useSelector((state) => state.user.userData);

  const [currentOrder, setCurrentOrder] = useState(null);
  const [assignments, setAssignments] = useState([]);

  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [acceptingId, setAcceptingId] = useState(null);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otp, setOtp] = useState("");

  const serverURL = import.meta.env.VITE_SERVER_URL;

  const getCurrentOrder = async () => {
    try {
      const res = await axios.get(`${serverURL}/api/order/currentorder`, {
        withCredentials: true,
      });

      setCurrentOrder(res.data || null);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAssignments = async () => {
    try {
      setLoadingAssignments(true);

      const res = await axios.get(`${serverURL}/api/order/getassignment`, {
        withCredentials: true,
      });

      setAssignments(res.data || []);
    } catch (err) {
      console.error("Failed to fetch assignments:", err.message);
      toast.error("Failed to fetch delivery assignments");
    } finally {
      setLoadingAssignments(false);
    }
  };

  const acceptOrder = async (assignmentId) => {
    if (!assignmentId) {
      toast.error("Invalid assignment");
      return;
    }

    try {
      setAcceptingId(assignmentId);

      await axios.get(`${serverURL}/api/order/acceptorder/${assignmentId}`, {
        withCredentials: true,
      });

      toast.success("Order accepted");

      setAssignments([]);
      await getCurrentOrder();
    } catch (err) {
      console.error("Accept order failed:", err.message);
      toast.error(err.response?.data?.message || "Failed to accept order");
    } finally {
      setAcceptingId(null);
    }
  };

  const sendOtp = async () => {
    if (!currentOrder?._id || !currentOrder?.shopOrder?._id) {
      toast.error("Order information missing");
      return;
    }

    try {
      setSendingOtp(true);

      const res = await axios.post(
        `${serverURL}/api/order/deliveryotp`,
        {
          orderId: currentOrder._id,
          shopOrderId: currentOrder.shopOrder._id,
        },
        { withCredentials: true }
      );

      toast.success(res.data?.message || "OTP sent to customer");

      setShowOtpBox(true);
    } catch (err) {
      console.error("Sending OTP failed:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  const verifyOtp = async () => {
    console.log("Verifying OTP")
    if (!currentOrder?._id || !currentOrder?.shopOrder?._id) {
      toast.error("Order information missing");
      return;
    }

    if (otp.length !== 6) {
      toast.error("Enter valid 6 digit OTP");
      return;
    }

    try {
      setVerifyingOtp(true);

      const res = await axios.post(
        `${serverURL}/api/order/verifydeliveryotp`,
        {
          orderId: currentOrder._id,
          shopOrderId: currentOrder.shopOrder._id,
          otp: otp,
        },
        { withCredentials: true }
      );

      toast.success(res.data.message);

      setShowOtpBox(false);
      setOtp("");
      setCurrentOrder(null);

      fetchAssignments();
    } catch (err) {
      console.log(err.response?.data);
      toast.error(err.response?.data?.message || "OTP verification failed");
    } finally {
      setVerifyingOtp(false);
    }
  };

  useEffect(() => {
    getCurrentOrder();
    fetchAssignments();

    const interval = setInterval(() => {
      getCurrentOrder();
      fetchAssignments();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Toaster />

      <div className="max-w-3xl mx-auto p-4 space-y-6">

        <div className="bg-white rounded-2xl p-5 shadow-sm flex justify-between items-center">
          <div>
            <h1 className="text-xl font-black text-gray-900">
              Hi, {userData?.fullName || "Delivery Partner"}
            </h1>
            <p className="text-sm text-gray-500">
              Ready for your next delivery?
            </p>
          </div>

          <span className="px-4 py-1.5 bg-green-100 text-green-700 text-xs font-black rounded-full">
            ONLINE
          </span>
        </div>

        {currentOrder && (
          <div className="bg-white rounded-2xl p-5 shadow-md space-y-4">

            <div className="flex justify-between items-center">
              <h2 className="text-lg font-black text-green-700">
                Current Delivery
              </h2>

              <span className="px-3 py-1 text-xs font-black bg-green-100 text-green-700 rounded-full">
                ACTIVE
              </span>
            </div>

            <div className="text-sm font-bold text-gray-700">
              Shop:
              <span className="text-orange-600 ml-1">
                {currentOrder.shopOrder?.shop?.name}
              </span>
            </div>

            <div className="flex items-start gap-2 text-sm text-gray-700">
              <MapPin size={18} className="text-red-500 mt-0.5" />
              <p>{currentOrder.deliveryAddress?.text}</p>
            </div>

            <div className="flex justify-between text-sm font-bold text-gray-800">

              <div className="flex items-center gap-1">
                <Package size={16} />
                {currentOrder.shopOrder?.shopItems?.length || 0} items
              </div>

              <div className="flex items-center gap-1">
                <IndianRupee size={16} />
                {currentOrder.shopOrder?.subTotal}
              </div>

            </div>

          </div>
        )}

        {!currentOrder && (
          <>
            {loadingAssignments ? (
              <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
                <p className="text-gray-500 font-semibold">
                  Loading assignments...
                </p>
              </div>
            ) : assignments.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
                <p className="text-gray-500 font-semibold">
                  No delivery assignments available
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Stay online to receive new orders
                </p>
              </div>
            ) : (
              <div className="space-y-4">

                {assignments.map((a) => (
                  <div
                    key={a.assignmentId}
                    className="bg-white rounded-2xl p-5 shadow-md border"
                  >

                    <div className="flex justify-between mb-3">
                      <h3 className="text-lg font-black text-orange-600">
                        {a.shopName}
                      </h3>

                      <span className="text-xs font-bold text-gray-400">
                        #{a.orderId?.slice(-6)}
                      </span>
                    </div>

                    <div className="flex gap-2 text-sm text-gray-700">
                      <MapPin size={18} className="text-red-500" />
                      {a.deliveryAddress?.text}
                    </div>

                    <div className="flex justify-between items-center mt-4">

                      <div className="flex gap-4 text-sm font-black">

                        <div className="flex items-center gap-1">
                          <Package size={16} />
                          {a.items?.length || 0}
                        </div>

                        <div className="flex items-center gap-1">
                          <IndianRupee size={16} />
                          {a.subTotal}
                        </div>

                      </div>

                      <button
                        disabled={acceptingId === a.assignmentId}
                        onClick={() => acceptOrder(a.assignmentId)}
                        className={`px-6 py-2 rounded-xl font-black transition ${
                          acceptingId === a.assignmentId
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-orange-600 text-white active:scale-95"
                        }`}
                      >
                        {acceptingId === a.assignmentId
                          ? "ACCEPTING..."
                          : "ACCEPT"}
                      </button>

                    </div>

                  </div>
                ))}

              </div>
            )}
          </>
        )}

        {currentOrder && (
          <div className="bg-white rounded-2xl p-3 shadow-md">

            <DeliveryBoyTracking data={currentOrder} />

            {!showOtpBox ? (
              <button
                disabled={sendingOtp}
                onClick={sendOtp}
                className={`w-full py-4 text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 transition ${
                  sendingOtp
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 active:scale-[0.98]"
                }`}
              >
                {sendingOtp ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <CheckCircleIcon className="w-5 h-5" />
                    Mark As Delivered
                  </>
                )}
              </button>
            ) : (
              <div className="mt-4 space-y-4">

                <div className="text-center">
                  <p className="text-gray-500 text-sm">
                    Confirmation Required
                  </p>

                  <p className="text-gray-800 font-medium">
                    Enter OTP sent to
                    <span className="text-orange-600 font-bold ml-1">
                      {currentOrder.user.fullName}
                    </span>
                  </p>
                </div>

                <input
                  type="text"
                  maxLength="6"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="000000"
                  className="w-full py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-center text-2xl font-bold tracking-[0.5em]"
                />

                <div className="flex gap-3">

                  <button
                    className="flex-1 py-3 bg-gray-100 text-gray-600 font-semibold rounded-xl"
                    onClick={() => setShowOtpBox(false)}
                  >
                    Cancel
                  </button>

                  <button
                    disabled={verifyingOtp || otp.length !== 6}
                    onClick={verifyOtp}
                    className={`flex-1 py-3 rounded-xl font-bold text-white cursor-pointer ${
                      verifyingOtp
                        ? "bg-gray-400"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {verifyingOtp ? "VERIFYING..." : "Verify & Finish"}
                  </button>

                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default DeliveryBoyDashboard;