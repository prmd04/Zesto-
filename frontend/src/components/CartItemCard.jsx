import { Plus, Minus, Trash2,IndianRupee } from "lucide-react";
import { useDispatch } from "react-redux";
import { updateQuantity,removeItem } from "../redux/userSlice"; 

function CartItemCard({ data }) {
  const dispatch = useDispatch();
  const totalPrice = data.price * data.quantity;

  const handleIncrease = () => {
    dispatch(updateQuantity({ id: data.id, quantity: data.quantity + 1 }));
  };

  const handleDecrease = () => {
    dispatch(updateQuantity({ id: data.id, quantity: data.quantity - 1 }));
  };

  const handleRemove = () => {
    dispatch(removeItem(data.id));
  };

  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
      {/* Left side: Image and Info */}
      <div className="flex items-center gap-4">
        <img 
          src={data.image} 
          alt={data.name} 
          className="w-20 h-20 object-cover rounded-lg border" 
        />
        <div>
          <h1 className="font-semibold text-gray-800">{data.name}</h1>
          <p className="text-sm text-gray-500 flex items-center gap-0.5">
            <IndianRupee size={14}/><span>{data.price.toFixed(2)} each</span>
          </p>
          <p className="font-bold text-[#ff4d2d] flex items-center" >  <IndianRupee size={14}/><span>{totalPrice.toFixed(2)}</span></p>
        </div>
      </div>

      {/* Right side: Controls */}
      <div className="flex items-center gap-6">
        {/* Quantity Controls */}
        <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 p-1">
          <button 
            onClick={handleDecrease}
            className="p-1 hover:bg-white rounded-md transition-colors text-gray-600 cursor-pointer"
          >
            <Minus size={18} />
          </button>
          
          <span className="px-3 font-medium text-gray-800 min-w-10 text-center">
            {data.quantity}
          </span>

          <button 
            onClick={handleIncrease}
            className="p-1 hover:bg-white rounded-md transition-colors text-gray-600 cursor-pointer"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* Trash Button */}
        <button 
          onClick={handleRemove}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all rounded-full cursor-pointer"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}

export default CartItemCard;