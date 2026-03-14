import { IndianRupee,Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setMyShopData } from '../redux/ownerSlice';
import { useState } from 'react';
import Loader from './Loader';

const FoodItemCart = ({ item }) => {
  
  const [loading,setLoading]=useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  if (!item) return null;

  const isVeg = item.foodtype === "veg";

  const handleDelete = async ()=>{
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8000/api/item/deleteitem/${item._id}`,{withCredentials:true});

      setLoading(false);
      navigate("/");

      dispatch(setMyShopData(res.data));
    } catch (error) {
      setLoading(false);
      console.log(error)
    }
  }

  if(loading){
    return <Loader/>
  }
  return (
    <div className="flex justify-center w-full min-w-lg p-2">
      <div className="bg-white w-full rounded-2xl border border-orange-100 shadow-sm hover:shadow-md transition-all duration-300 flex overflow-hidden h-32">
        
        {/* LEFT SIDE: IMAGE CONTAINER */}
        <div className="relative w-48 h-full flex--0 bg-gray-100">
          <img
            src={item.image}
            alt={item.name}
            // THE FIX: Added these classes to make the image fill the container
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => { 
              e.target.src = 'https://via.placeholder.com/150?text=No+Image'; 
            }}
          />

          {/* Veg/Non-Veg Indicator */}
          <div className="absolute top-2 left-2 bg-white/90 p-1 rounded shadow-sm">
            <div className={`w-3 h-3 border-2 flex items-center justify-center ${isVeg ? 'border-green-600' : 'border-red-600'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: CONTENT */}
        <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
          <div>
            <h3 className="font-bold text-gray-800 text-base truncate">
              {item.name}
            </h3>
            <p className="text-[10px] font-semibold text-orange-500 bg-orange-50 inline-block px-2 py-0.5 rounded mt-1 uppercase tracking-wider">
              {item.category}
            </p>
          </div>
         
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-900 font-bold text-lg">
              <IndianRupee size={16} />
              <span>{item.price}</span>
            </div>
            
             <div className="flex gap-1">
                <button 
                  onClick={() => navigate(`/editfooditem/${item._id}`)}
                  className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                  title="Edit Item"
                >
                  <Pencil size={16} />
                </button>
                <button 
                  onClick={handleDelete}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  title="Delete Item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    
  );
};

export default FoodItemCart;