import React from "react";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import { UtensilsCrossed, Edit2, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useGetCurrentShop from "../hooks/useGetCurrentShop";
import Loader from "./Loader";
import FoodItemCard from "./FoodItemCart";

const OwnerDashboard = () => {
  useGetCurrentShop();
  const navigate = useNavigate();
  

  const { myShopData, loading } = useSelector((state) => state.owner);

  if (loading) return <Loader />;

  return (
    <div className="w-full min-h-screen bg-[#fff9f6]">
      <Navbar />

      {/* Add Restaurant Card */}
      {!myShopData && (
        <div className="flex justify-center items-center p-4 sm:p-6 w-full">
          <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center">
            <div className="bg-orange-50 p-4 rounded-full mb-6">
              <UtensilsCrossed className="text-orange-600 w-12 h-12 sm:w-16 sm:h-16" />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              Add Your Restaurant
            </h2>

            <p className="text-gray-600 mb-6 text-sm sm:text-base">
              Join our food delivery platform and reach thousands of hungry
              customers every day.
            </p>

            <button
              onClick={() => navigate("/create-edit-shop")}
              className="bg-[#ff4d2d] text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-orange-600 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      )}

      {/* Shop Card */}
      {myShopData && (
        <div className="w-full flex flex-col items-center gap-4 px-4 sm:px-6 mb-6">
          {/* Header - Reduced top margin */}
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 flex items-center justify-center gap-2 mt-6 text-center">
            <UtensilsCrossed className="text-[#ff4d2d] w-6 h-6 sm:w-8 sm:h-8" />
            Welcome to {myShopData.name}
          </h1>

          
          <div className="bg-white shadow-md rounded-xl overflow-hidden border border-orange-100 hover:shadow-lg transition-all duration-300 w-full max-w-xl relative group">
            {/* Edit Button */}
            <button
              onClick={() => navigate("/create-edit-shop")}
              className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-md text-gray-700 hover:text-[#ff4d2d] transition-colors z-10"
            >
              <Edit2 size={16} />
            </button>

            {/* Shop Image - */}
            <div className="relative h-32 sm:h-44 w-full bg-gray-100">
              <img
                src={myShopData.image}
                alt={myShopData.name}
                className="w-full min-w-xl h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Shop Details */}
            <div className="p-4 sm:p-5">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                    {myShopData.name}
                  </h2>
                  <div className="flex items-center gap-1 text-orange-600 text-sm font-medium">
                    <span>{myShopData.city}</span>
                    <span>•</span>
                    <span>{myShopData.state}</span>
                  </div>
                </div>
                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Active
                </span>
              </div>

              <div className="border-t border-gray-100 pt-3 flex items-center gap-2">
                <MapPin size={14} className="text-orange-600 flex-0" />
                <p className="text-gray-500 text-xs italic truncate">
                  {myShopData.address}
                </p>
              </div>
            </div>
          </div>

          {/* Add Food Item Section would go here and now be visible on screen */}
          {myShopData.items.length == 0 && (
            <div className="w-full max-w-xl border-2 border-dashed border-orange-200 rounded-xl p-6 flex flex-col items-center">
              <p className="text-gray-400 text-sm mb-2">
                Share your delicious creations with our customers by adding them
                to the menu
              </p>
              <button
                onClick={() => navigate("/addfooditem")}
                className="text-orange-600 font-bold hover:underline"
              >
                + Add Food Item
              </button>
            </div>
          )}
          {myShopData.items.length > 0 && (
            <div className="flex flex-col justify-center gap-6 mt-8">
              {myShopData.items.map((item) => (
                <FoodItemCard key={item._id} item={item} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
