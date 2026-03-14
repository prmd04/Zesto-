import React from "react";

function CategoryCard({ image, name , onClick }) {
  return (
    <div
      className="
        w-40 md:w-45 
        shrink-0 
        rounded-3xl 
        bg-white 
        border border-gray-100 
        shadow-sm 
        hover:shadow-xl 
        transition-all 
        duration-300 
        cursor-pointer 
        group 
        mb-2
      "
      onClick={onClick}
    >
      {/* Image Container - Fixed Aspect Ratio */}
      <div className="w-full aspect-square overflow-hidden rounded-2xl p-2">
        <img
          src={image}
          alt={name}
          className="
            w-full h-full 
            object-cover 
            rounded-2xl
            group-hover:scale-110 
            transition-transform 
            duration-500
          "
        />
      </div>

      {/* Text Container */}
      <div className="pb-4 px-2 text-center">
        <p className="text-sm md:text-base font-bold text-gray-700 group-hover:text-[#ff4d2d] transition-colors truncate">
          {name}
        </p>
      </div>
    </div>
  );
}

export default CategoryCard;