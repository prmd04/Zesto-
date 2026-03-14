import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Home, ShoppingBag } from 'lucide-react';


const OrderPlaced = () => {
  const navigate = useNavigate();
  

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        
        {/* Animated-style Success Ring */}
        <div className="relative flex justify-center mb-8">
          <div className="absolute animate-ping inline-flex h-24 w-24 rounded-full bg-green-100 opacity-75"></div>
          <div className="relative bg-green-50 p-6 rounded-full">
            <CheckCircle className="w-16 h-16 text-green-500" strokeWidth={1.5} />
          </div>
        </div>

        {/* Content */}
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Order Placed!
        </h1>
        <p className="text-lg text-gray-600 mb-10 leading-relaxed">
        "Thanks for shopping with us! We're already getting your order ready. Head over to My Orders to follow its journey!"
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button 
            onClick={() => navigate('/myorders')}
            className="w-full bg-[#ff4d2d] hover:hover:bg-orange-600  text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-5 h-5" />
            Go To MyOrder
          </button>
          
         
        </div>

        {/* Minimal Footer */}
        <p className="mt-12 text-sm text-gray-400">
          Need help? <span className="underline cursor-pointer hover:text-gray-600">Contact Support</span>
        </p>
      </div>
    </div>
  );
};

export default OrderPlaced;