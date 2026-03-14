import React, { useState } from "react";
import { Star, Minus, Plus, ShoppingCart, Leaf, Drumstick } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/userSlice";
import toast, { Toaster } from "react-hot-toast";

function FoodCard({ data }) {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);

  const additem = () => {
    toast.success("Item added into cart");
    dispatch(
      addToCart({
        id: data._id,
        name: data.name,
        price: data.price,
        image: data.image,
        shop: data.shop,
        quantity,
        foodType: data.foodType,
      }),
    );
  };

  // Helper to render star ratings using Lucide
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          className={`${
            i <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />,
      );
    }
    return stars;
  };

  return (
    <div className="w-65 rounded-3xl border border-gray-100 bg-white shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col group">
      <Toaster />
      {/* Image Section */}
      <div className="relative w-full h-45 overflow-hidden rounded-t-3xl bg-gray-50">
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Veg/Non-Veg Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-lg shadow-sm">
          {data.foodtype=="veg" ? (
            <Leaf className="text-green-500" size={16} />
          ) : (
            <Drumstick className="text-red-500" size={16} />
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <h1 className="font-bold text-gray-800 text-lg leading-tight truncate w-[70%]">
            {data.name || "Delicious Item"}
          </h1>
          <span className="font-black text-[#ff4d2d] text-lg">
            ₹{data.price}
          </span>
        </div>

        {/* Rating Row */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {renderStars(data.rating?.average || 0)}
          </div>
          <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
            ({data.rating?.count || 0})
          </span>
        </div>

        <p className="text-gray-500 text-xs line-clamp-2 min-h-8">
          {data.description || "Freshly prepared with the finest ingredients."}
        </p>

        {/* Action Row */}
        <div className="flex items-center justify-between mt-3 bg-gray-50 p-1 rounded-2xl">
          <div className="flex items-center gap-3 px-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-600 hover:text-[#ff4d2d] transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="font-bold text-gray-800 w-4 text-center text-sm">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-600 hover:text-green-500 transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>

          <button
            className="bg-[#ff4d2d] hover:bg-[#e03d20] text-white p-3 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
            onClick={additem}
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default FoodCard;
