import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Added useNavigate
import { Store, MapPin, UtensilsCrossed, Loader2, ArrowLeft } from 'lucide-react'; // Added ArrowLeft
import FoodCard from "../components/FoodCard";
const serverURL = import.meta.env.VITE_SERVER_URL;

const Shop = () => {
  const { shopId } = useParams();
  const navigate = useNavigate(); // Initialize navigate
  const [shop, setShop] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const cleanShopId = shopId?.startsWith(":") ? shopId.slice(1) : shopId;

  const handleShop = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${serverURL}/api/item/getitembyshop/${cleanShopId}`, { withCredentials: true });
      setShop(res.data.shop);
      setItems(res.data.items);
    } catch (error) {
      console.error("Error fetching shop data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cleanShopId) handleShop();
  }, [cleanShopId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-red-500 animate-spin mb-2" />
        <p className="text-gray-500 font-medium">Loading your favorite kitchen...</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {shop && (
        <div className='relative w-full h-72 md:h-[450px] overflow-hidden'>
          {/* Back Button */}
          <button 
            onClick={() => navigate(-1)} 
            className="absolute top-6 left-6 z-20 p-2 bg-orange-400 rounded-full border border-white/30 text-white hover:bg-orange-600 transition-all active:scale-95 shadow-lg cursor-pointer"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <img 
            src={shop.image} 
            alt={shop.name} 
            className='w-full h-full object-cover scale-105 transition-transform duration-700' 
          />
          
          <div className='absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col justify-center items-center text-center px-4'>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-full mb-4 border border-white/20 shadow-2xl">
                <Store className='text-white w-10 h-10' />
            </div>
            
            <h1 className='text-4xl md:text-6xl font-black text-white drop-shadow-2xl tracking-tight'>
              {shop.name}
            </h1>
            
            <div className='flex items-center gap-2 mt-4 bg-black/30 px-4 py-2 rounded-full border border-white/10'>
              <MapPin className='text-red-500 w-5 h-5 fill-red-500/20' />
              <p className='text-sm md:text-lg font-medium text-gray-100'>
                {shop.address}
              </p>
            </div>
          </div>
        </div>
      )}

      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-10 border-b border-gray-200 pb-4">
            <UtensilsCrossed className="text-red-500 w-6 h-6" />
            <h2 className="text-3xl font-extrabold text-gray-900">
                Our Menu
            </h2>
            <span className="ml-auto bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold">
                {items.length} Items
            </span>
        </div>

        {items && items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {items.map((item) => (
              <div key={item._id} className="transform transition-all duration-300 hover:-translate-y-2">
                <FoodCard data={item} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-gray-200 shadow-sm">
            <div className="bg-gray-100 p-6 rounded-full mb-4">
                <UtensilsCrossed className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">No dishes available yet</h3>
            <p className="text-gray-500 mt-2 text-center max-w-xs">
              This shop hasn't uploaded any menu items. Please check back later!
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Shop;