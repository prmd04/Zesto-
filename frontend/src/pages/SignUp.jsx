import React, { useState } from "react";
import axios from "axios";
import { GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../firebase";
import { signInWithPopup } from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import {
  User,
  Mail,
  Phone,
  UtensilsCrossed,
  Eye,
  EyeOff,
  Store,
  Bike,
  Loader2,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { setUserData } from "../redux/userSlice.js";


const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleData, setGoogleData] = useState(null);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [phone, setPhone] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    mobileNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRoleSelect = (selectedRole) => {
    setFormData((prev) => ({ ...prev, role: selectedRole }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match!", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }

    setLoading(true);
    const { confirmPassword, ...dataToSend } = formData;

    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/signup",
        dataToSend,
        { withCredentials: true }
      );
      dispatch(setUserData(response.data));
      toast.success("Account created successfully!");

      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Registration failed";
      console.log(error.message);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { id: "user", label: "User", icon: User },
    { id: "owner", label: "Owner", icon: Store },
    { id: "deliveryBoy", label: "Delivery", icon: Bike },
  ];

  const handleGoogleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const googleUser = {
        fullName: user.displayName,
        email: user.email,
      };
      setGoogleData(googleUser);

      setShowPhoneModal(true);
    } catch (error) {
      console.log(error.message);
      toast.error("authentication failed");
    }
  };

  const completeGoogleSignup = async () => {
    if (!phone || phone.length < 10) {
      return toast.error("Enter a valid phone number");
    }

    setLoading(true);
    try {
      const payload = {
        ...googleData,
        mobileNumber: phone,
        role: formData.role,
      };
      const {data} = await axios.post(
        "http://localhost:8000/api/auth/signupwithgoogle",
        payload,
        { withCredentials: true }
      );
      dispatch(setUserData(data));
      toast.success("Signup complete!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-4 font-sans text-slate-900">
      <Toaster position="top-center" reverseOrder={false} />

      {showPhoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl border border-slate-100">
            <div className="flex flex-col items-center mb-6">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Phone className="text-orange-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Phone Required</h3>
              <p className="text-slate-500 text-sm text-center mt-2">
                Please enter your mobile number to complete your registration.
              </p>
            </div>

            <div className="relative mb-6">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Mobile Number"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all text-sm font-medium"
              />
            </div>

            <button
              onClick={completeGoogleSignup}
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-100 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Complete Signup"}
            </button>
            
            <button 
              onClick={() => setShowPhoneModal(false)}
              className="w-full mt-3 text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-slate-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="max-w-110 w-full bg-white rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-10 border border-slate-100">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200 mb-4">
            <UtensilsCrossed className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800">
            Create Account
          </h1>
          <p className="text-slate-400 text-sm font-medium mt-1">
            Join the Zesto community
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="mb-8">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">
              Select Role
            </p>
            <div className="grid grid-cols-3 gap-3">
              {roles.map((item) => {
                const Icon = item.icon;
                const isActive = formData.role === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={loading}
                    onClick={() => handleRoleSelect(item.id)}
                    className={`flex flex-col items-center justify-center py-3 rounded-xl border-2 transition-all duration-300 ${
                      isActive
                        ? "border-orange-500 bg-orange-50/50 text-orange-600"
                        : "border-slate-50 bg-slate-50/50 text-slate-400 hover:border-slate-200"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 mb-1 ${
                        isActive ? "text-orange-600" : "text-slate-400"
                      }`}
                    />
                    <span className="text-[10px] font-bold">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
            <input
              type="text"
              placeholder="Full Name"
              name="fullName"
              disabled={loading}
              value={formData.fullName}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50/80 border border-transparent rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all text-sm font-medium"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              disabled={loading}
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50/80 border border-transparent rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all text-sm font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                disabled={loading}
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-slate-50/80 border border-transparent rounded-xl focus:bg-white focus:border-orange-500 outline-none transition-all text-sm font-medium"
              />
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm"
                name="confirmPassword"
                disabled={loading}
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-4 pr-10 py-3.5 bg-slate-50/80 border border-transparent rounded-xl focus:bg-white focus:border-orange-500 outline-none transition-all text-sm font-medium"
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
          </div>

          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
            <input
              type="tel"
              placeholder="Mobile Number"
              name="mobileNumber"
              disabled={loading}
              value={formData.mobileNumber}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50/80 border border-transparent rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all text-sm font-medium"
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-100 transition-all duration-300 transform active:scale-95 mt-2 text-sm uppercase tracking-widest cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="text-center mb-3 mt-3">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            Or
          </p>
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={handleGoogleAuth}
          className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 py-3 rounded-xl font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 active:scale-[0.98] mb-6 cursor-pointer"
        >
          <FcGoogle className="w-5 h-5" />
          <span className="text-sm">Sign up with Google</span>
        </button>

        <p className="text-center text-slate-400 text-[11px] mt-8 font-bold uppercase tracking-wider">
          Have an account?{" "}
          <button
            onClick={() => navigate("/signin")}
            disabled={loading}
            className="text-orange-600 hover:underline text-sm cursor-pointer"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;