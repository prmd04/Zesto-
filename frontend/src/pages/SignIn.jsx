import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../firebase";
import { signInWithPopup } from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";
import {
  Mail,
  UtensilsCrossed,
  Eye,
  EyeOff,
  Lock,
  Loader2,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux";
import {setUserData} from "../redux/userSlice.js";


const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const payload = { email: user.email };

      const response = await axios.post(
        "http://localhost:8000/api/auth/singinwithgoogle",
        payload,
        { withCredentials: true },
      );
      dispatch(setUserData(response.data));
      toast.success("Welcome back!");
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("Account not found. Redirecting to complete signup...");
        navigate('/signup')
      } else {
        const errorMsg =
          error.response?.data?.message || "Google Sign-In failed";
        toast.error(errorMsg);
        console.error("Sign-in error:", error);
      }
    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/signin",
        formData,
        { withCredentials: true }
      );
      dispatch(setUserData(response.data));
      toast.success("Sign in successfully!");
      // console.log(response.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.log(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
   
    <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-4 font-sans text-slate-900">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-110 w-full bg-white rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-10 border border-slate-100">
        {/* Brand Logo & Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200 mb-4">
            <UtensilsCrossed className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800">
            Welcome Back
          </h1>
          <p className="text-slate-400 text-sm font-medium mt-1">
            Sign in to your Zesto account
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50/80 border border-transparent rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all text-sm font-medium"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50/80 border border-transparent rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all text-sm font-medium"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Forgot Password Link */}
          <div
            onClick={() => navigate("/forgotpassword")}
            className="block w-full text-right mb-6 text-sm font-semibold text-[#ff4d2d] hover:underline transition-colors duration-200 cursor-pointer"
          >
            Forgot Password?
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-100 transition-all duration-300 transform active:scale-95 mt-2 text-sm uppercase tracking-widest cursor-pointer ${loading ? "opacity-80 cursor-not-allowed" : ""}`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Elegant Divider */}
        <div className="text-center mb-3 mt-6">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            Or
          </p>
        </div>

        {/* Google Sign In */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 py-3 rounded-xl font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 active:scale-[0.98] mb-6 cursor-pointer"
        >
          <FcGoogle className="w-5 h-5" />
          <span className="text-sm">Sign in with Google</span>
        </button>

        {/* Sign Up Link */}
        <p className="text-center text-slate-400 text-[11px] mt-8 font-bold uppercase tracking-wider">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-orange-600 hover:underline text-sm cursor-pointer"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
