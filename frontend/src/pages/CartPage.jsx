import { ArrowLeft, IndianRupee } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CartItemCard from "../components/CartItemCard";
import { useSelector } from "react-redux";

function CartPage() {
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.user.cartItems);
  const totalAmount = useSelector((state) => state.user.totalAmount);

  return (
    <div className="min-h-screen bg-[#fff9f6] flex justify-center p-6">
      <div className="w-full max-w-200">
        <div className="flex items-center gap-5 mb-8">
          <div
            className="cursor-pointer hover:opacity-70 transition-opacity"
            onClick={() => navigate("/")}
          >
            <ArrowLeft size={30} className="text-[#ff4d2d]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Your Cart</h1>
        </div>

        <div className="space-y-4">
          {cartItems && cartItems.length > 0 ? (
            <>
              <div className="space-y-4 mb-8">
                {cartItems.map((item) => (
                  <CartItemCard key={item.id} data={item} />
                ))}
              </div>

              {/* Order Summary and Checkout */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-500 font-medium uppercase tracking-wider text-sm">
                    Total Amount
                  </span>
                  <div className="flex items-center text-3xl font-extrabold text-slate-900">
                    <IndianRupee size={28} strokeWidth={3} />
                    <span>{totalAmount?.toLocaleString("en-IN")}.00</span>
                  </div>
                </div>

                <button 
                  className="w-full bg-[#ff4d2d] text-white py-4 rounded-xl font-bold text-lg 
                             hover:bg-[#e64429] transition-all active:scale-[0.98] 
                             shadow-lg shadow-[#ff4d2d]/20 cursor-pointer"
                onClick={()=>navigate("/checkout")}>
                  Proceed to Checkout
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
              <p className="text-gray-500 text-lg">Your cart is empty.</p>
              <button
                onClick={() => navigate("/")}
                className="mt-4 text-[#ff4d2d] font-bold text-lg hover:underline"
              >
                Go shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CartPage;