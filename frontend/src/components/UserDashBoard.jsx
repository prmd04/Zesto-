import React, { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import categories from "../Category";
import { ChevronLeft, ChevronRight,SearchX } from "lucide-react";
import { useSelector } from "react-redux";
import FoodCard from "./FoodCard";
import CategoryCard from "./CategoryCard";
import { useNavigate } from "react-router-dom";

const UserDashBoard = () => {
  const navigate = useNavigate();
  const categoryScrollRef = useRef(null);
  const shopScrollRef = useRef(null);
  const [updateItemsList,setUpdateItemsList]=useState([]);

  const { currentCity, shopInMyCity, itemInMyCity,searchItems,searchText} = useSelector(
    (state) => state.user,
  );

  const [canCategoryScrollLeft, setCanCategoryScrollLeft] = useState(false);
  const [canCategoryScrollRight, setCanCategoryScrollRight] = useState(false);
  const [canShopScrollLeft, setCanShopScrollLeft] = useState(false);
  const [canShopScrollRight, setCanShopScrollRight] = useState(false);

  const scroll = (ref, direction) => {
    if (!ref.current) return;
    ref.current.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };


  const updateCategoryScrollButton = () => {
    const container = categoryScrollRef.current;
    if (!container) return;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanCategoryScrollLeft(scrollLeft > 0);
    setCanCategoryScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  const updateShopScrollButton = () => {
    const container = shopScrollRef.current;
    if (!container) return;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanShopScrollLeft(scrollLeft > 0);
    setCanShopScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  };


  const handleFilterByCatogory = (category) => {
    if(category==="All"){
      setUpdateItemsList(itemInMyCity);
    }else{
      const filterdList = itemInMyCity.filter((item) => item.category === category);
      setUpdateItemsList(filterdList);
    }
  }

  useEffect(() => {
    updateCategoryScrollButton();
    updateShopScrollButton();
  }, [shopInMyCity, itemInMyCity]);

  useEffect(()=>{
    setUpdateItemsList(itemInMyCity);
  },[itemInMyCity])

  return (
    <div className="bg-gray-50 min-h-screen w">
      <Navbar />

   {/* Case 1: Search results found */}
{searchItems && searchItems.length > 0 ? (
  <div className='w-full max-w-7xl mx-auto flex flex-col gap-8 items-start p-6 bg-white shadow-sm border border-gray-100 rounded-3xl mt-8'>
    <div className="flex items-center gap-3 w-full border-b border-gray-100 pb-5">
      <div className="w-2 h-8 bg-red-500 rounded-full" /> 
      <h1 className='text-gray-900 text-2xl sm:text-3xl font-bold tracking-tight'>
        Search Results
      </h1>
      <span className="ml-auto text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">
        {searchItems.length} found
      </span>
    </div>

    <div className='w-full flex flex-wrap gap-8 justify-center sm:justify-start'>
      {searchItems.map((item) => (
        <FoodCard key={item._id} data={item} />
      ))}
    </div>
  </div>
) : (
  /* Case 2: Query exists but no items found */
  searchText && (
    <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 mt-8">
      <h3 className="text-xl font-bold text-gray-800">No matches found</h3>
      <p className="text-gray-500 mt-2 text-center max-w-xs">
        We couldn't find anything for <span className="text-red-500 font-semibold">"{searchText}"</span>.
      </p>
    </div>
  )
)}

      {/* SECTION 1: CATEGORIES */}
      <section className="py-8 px-4 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Inspiration Of Your First Order
        </h2>

        <div className="relative">
          {canCategoryScrollLeft && (
            <button
              onClick={() => scroll(categoryScrollRef, "left")}
              className="hidden md:flex absolute left-0 top-25 -translate-y-1/2 z-10
                         h-8 w-8 items-center justify-center rounded-full text-white
                         bg-orange-500 shadow-md hover:bg-orange-600 transition"
            >
              <ChevronLeft size={16} />
            </button>
          )}

          {canCategoryScrollRight && (
            <button
              onClick={() => scroll(categoryScrollRef, "right")}
              className="hidden md:flex absolute right-0 top-25 -translate-y-1/2 z-10
                         h-8 w-8 items-center justify-center rounded-full text-white
                         bg-orange-500 shadow-md hover:bg-orange-600 transition"
            >
              <ChevronRight size={16} />
            </button>
          )}

          <div
            ref={categoryScrollRef}
            onScroll={updateCategoryScrollButton}
            className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth px-2 pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((item, index) => (
              <CategoryCard 
                key={index} 
                image={item.image} 
                name={item.category}
                onClick = {()=>handleFilterByCatogory(item.category)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: SHOPS IN MY CITY */}
      <section className="py-8 px-4 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Best Shop in {currentCity}
        </h2>

        <div className="relative">
          {canShopScrollLeft && (
            <button
              onClick={() => scroll(shopScrollRef, "left")}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10
                         h-8 w-8 items-center justify-center rounded-full text-white
                         bg-orange-500 shadow-md hover:bg-orange-600 transition"
            >
              <ChevronLeft size={16} />
            </button>
          )}

          {canShopScrollRight && (
            <button
              onClick={() => scroll(shopScrollRef, "right")}
              className="hidden md:flex absolute right-0 top-15 -translate-y-1/2 z-10
                         h-8 w-8 items-center justify-center rounded-full text-white
                         bg-orange-500 shadow-md hover:bg-orange-600 transition"
            >
              <ChevronRight size={16} />
            </button>
          )}

          <div
            ref={shopScrollRef}
            onScroll={updateShopScrollButton}
            className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth px-2 pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {shopInMyCity && shopInMyCity.length > 0 ? (
              shopInMyCity.map((shop, index) => (
                <CategoryCard 
                  key={index} 
                  image={shop.image} 
                  name={shop.name}
                  onClick={()=>navigate(`/shop/${shop._id}`)}
                 
                />
                
              ))
            ) : (
              <p className="text-gray-500 px-2">No shops found in {currentCity}</p>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 3: SUGGESTED FOOD ITEMS */}
      <section className="py-8 px-4 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Suggested Food Items
        </h2>

        {updateItemsList && updateItemsList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-10 justify-items-center">
            {updateItemsList.map((item, index) => (
              <FoodCard key={item._id || index} data={item} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 bg-white rounded-3xl border border-dashed border-gray-300">
            <p className="text-gray-500 font-medium">
              No items found in {currentCity}
            </p>
            <p className="text-sm text-gray-400">
              Try switching to a different city!
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default UserDashBoard;