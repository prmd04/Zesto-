import React from "react";
import {
  Package,
  Clock,
  CreditCard,
  ReceiptText,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserOrderCard = ({ order }) => {

  const navigate = useNavigate();
  const getStatusStyle = () => {
     const styles = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    preparing: "bg-blue-600 text-white border-blue-300",
    "out for delivery": "bg-purple-100 text-purple-800 border-purple-300",
    delivered: "bg-green-100 text-green-800 border-green-300",
    cancelled: "bg-red-100 text-red-800 border-red-300",
  };
    return (
      styles[order.shopOrders[0].status.toLowerCase()] ||
      "bg-green-100 text-white"
    );
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-md hover:shadow-xl transition-all overflow-hidden mb-8">

      {/* HEADER */}
      <div className="p-4 sm:p-6 border-b-2 border-gray-50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-gray-50/50">
        <div className="flex gap-4 items-center">
          <div className="p-3 sm:p-4 bg-orange-100 rounded-2xl shadow-inner">
            <Package size={24} className="text-orange-600 sm:size-7" />
          </div>

          <div>
            <h4 className="font-black text-gray-900 text-lg sm:text-xl tracking-tight">
              Order #{order._id.slice(-6).toUpperCase()}
            </h4>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-500 mt-1">
              <Clock size={16} />
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>

        <span
          className={`self-start sm:self-auto px-4 py-1.5 rounded-xl text-[10px] sm:text-xs font-black border-2 uppercase tracking-widest text-green-300 ${getStatusStyle()}`}
        >
          {order.shopOrders[0].status}
        </span>
      </div>

      {/* SHOPS & ITEMS */}
      <div className="p-4 sm:p-6 space-y-8">
        {order.shopOrders.map((shopOrder) => (
          <div key={shopOrder._id}>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 mb-4">
              <h3 className="text-xl sm:text-2xl font-black text-orange-600 flex items-center gap-2 italic">
                <ReceiptText size={22} />
                {shopOrder.shop.name}
              </h3>
              <span className="text-xs sm:text-sm font-black text-gray-400">
                Subtotal: ₹{shopOrder.subTotal}
              </span>
            </div>

            <div className="space-y-3">
              {shopOrder.shopItems.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 border-white shadow-sm shrink-0">
                      <img
                        src={item.item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div>
                      <p className="text-base sm:text-lg font-black text-gray-800">
                        {item.name}
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-orange-600">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>

                  <p className="text-lg sm:text-xl font-black text-gray-900 text-right">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="p-6 sm:p-8 bg-gray-900 flex flex-col sm:flex-row justify-between items-center gap-6 rounded-b-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3 sm:p-4 bg-blue-50 text-blue-600 rounded-2xl">
            <CreditCard size={24} className="sm:size-7" />
          </div>
          <div>
            <p className="text-[9px] text-gray-400 uppercase font-bold tracking-[0.15em]">
              Paid via
            </p>
            <p className="text-lg sm:text-xl font-bold capitalize text-white">
              {order.paymentMethod}
            </p>
          </div>
        </div>

        <div className="text-center sm:text-right">
          <p className="text-[9px] text-white uppercase font-bold tracking-[0.15em] mb-1">
            Total Amount Paid
          </p>
          <div className="flex items-baseline sm:justify-end gap-1">
            <span className="text-lg sm:text-xl font-bold text-white">₹</span>
            <span className="text-4xl sm:text-5xl font-black text-white tracking-tighter">
              {order.totalAmount}
            </span>
          </div>
        </div>
      </div>

      {/* ACTION */}
      {order.shopOrders[0].status === "out for delivery" && (<div className="flex justify-end p-3">
        <button className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-3 bg-gray-800 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-lg hover:shadow-orange-200 transition-all" onClick={()=> navigate(`/trackorder/${order._id}`)}>
          <span className="relative inline-flex h-3 w-3 rounded-full bg-orange-500"></span>
          TRACK ORDER
          <ChevronRight
            size={18}
            className="transition-transform group-hover:translate-x-2"
          />
        </button>
      </div>)}
      
    </div>
  );
};

export default UserOrderCard;
