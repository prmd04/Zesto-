import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2 } from "lucide-react";
const serverURL = import.meta.env.VITE_SERVER_URL;

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${serverURL}/api/auth/sendotp`,
        { email },
        { withCredentials: true }
      );

      toast.success("OTP sent successfully!");
      setStep(2);
      // console.log(response.data);
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      console.log(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  const handleVerifyOTP = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${serverURL}/api/auth/verifyotp`,
        { email, otp },
        { withCredentials: true }
      );
      toast.success("OTP verified successfully!");
      setStep(3);
      // console.log(response.data);
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      console.log(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${serverURL}/api/auth/resetpassword`,
        { email, newPassword: newPassword },
        { withCredentials: true }
      );
      toast.success("Password reset successfully!");
      navigate("/signin");
      // console.log(response.data);
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      console.log(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">

        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-800">Reset Password</h2>
          <p className="text-gray-500 text-sm mt-4">
            {step === 1 && "Enter your email to receive an OTP"}
            {step === 2 && "Enter the 6-digit code sent to your email"}
            {step === 3 && "Create a strong new password"}
          </p>
        </div>

        {/* Step 1: Email Input */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="example@gmail.com"
                value={email}
                disabled={loading}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zesto-orange focus:outline-none transition-all"
              />
            </div>
            <button
              onClick={handleSendOTP}
              disabled={loading}
              className="w-full bg-zesto-orange text-white py-3 rounded-lg font-bold transition-all duration-200 hover:scale-105 active:scale-95 shadow-md flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Get OTP"}
            </button>
          </div>
        )}

        {/* Step 2: OTP Input */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 text-center">Verification Code</label>
              <input
                type="text"
                maxLength="6"
                placeholder="0 0 0 0 0 0"
                value={otp}
                disabled={loading}
                onChange={(e) => setOTP(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-xl tracking-[10px] font-bold focus:ring-2 focus:ring-zesto-orange focus:outline-none"
              />
            </div>
            <button
              onClick={handleVerifyOTP}
              disabled={loading}
              className="w-full bg-zesto-orange text-white py-3 rounded-lg font-bold transition-all duration-200 hover:scale-105 active:scale-95 shadow-md flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Verify Code"}
            </button>
          </div>
        )}

        {/* Step 3: Password Reset */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                disabled={loading}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zesto-orange focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                disabled={loading}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zesto-orange focus:outline-none"
              />
            </div>
            <button
              className="w-full bg-zesto-orange text-white py-3 rounded-lg font-bold transition-all duration-200 hover:scale-105 active:scale-95 shadow-md flex items-center justify-center gap-2"
              onClick={handleResetPassword}
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Reset Password"}
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center border-t pt-6">
          <p className="text-sm text-gray-600">
            Remember your password? <Link to="/signin" className="text-zesto-orange font-bold hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;