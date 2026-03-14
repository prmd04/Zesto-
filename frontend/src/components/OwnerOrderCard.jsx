import React, { useState, useEffect } from "react";
import { MapPin, Clock, ChevronRight } from "lucide-react";
import axios from "axios";
const serverURL = import.meta.env.VITE_SERVER_URL;

const OwnerOrderCard = ({ order }) => {
  const { user, deliveryAddress, paymentMethod, createdAt, shopOrders } = order;
  const myShopOrder = shopOrders?.[0] || null;

  const [localStatus, setLocalStatus] = useState("");
  const [availableBoys, setAvailableBoys] = useState([]);

  useEffect(() => {
    if (myShopOrder) setLocalStatus(myShopOrder.status);
  }, [myShopOrder]);

  if (!myShopOrder) return null;

  const getStatusStyle = (status) => {
    const styles = {
      pending: "bg-orange-100 text-orange-700 border-orange-200",
      preparing: "bg-blue-100 text-blue-700 border-blue-200",
      "out for delivery": "bg-purple-100 text-purple-700 border-purple-200",
      delivered: "bg-green-100 text-green-700 border-green-200",
      cancelled: "bg-red-100 text-red-700 border-red-200",
    };
    return (
      styles[status?.toLowerCase()] ||
      "bg-gray-100 text-gray-700 border-gray-200"
    );
  };

  const handleChange = async (orderId, shopId, newStatus) => {
    const prev = localStatus;
    setLocalStatus(newStatus);
    try {
      const res = await axios.post(
        `${serverURL}/api/order/updatestatus/${orderId}/${shopId}`,
        { status: newStatus },
        { withCredentials: true },
      );
      setAvailableBoys(res.data.availableBoys || []);
    } catch {
      setLocalStatus(prev);
    }
  };

  return (
    <div className="w-full max-w-8xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm mb-6 overflow-hidden ">
      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3">
        {/* LEFT SECTION – ORDER INFO */}
        <div className="lg:col-span-2 border-b lg:border-b-0 lg:border-r border-gray-200">
          {/* USER INFO */}
          <div className="p-4 sm:p-5 border-b border-gray-100">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user?.fullName?.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xlg font-bold text-gray-900 truncate">
                    {user?.fullName}
                  </h2>
                  <p className="text-xs text-gray-500 font-medium">
                    {user?.mobile}
                  </p>
                </div>
              </div>

              <div
                className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase border ${getStatusStyle(localStatus)}`}
              >
                {localStatus}
              </div>
            </div>

            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-1.5 text-gray-400 text-[11px] font-bold uppercase">
                <Clock size={12} />
                Ordered:{" "}
                {new Date(createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>

              <div className="flex items-start gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                <MapPin size={14} className="text-red-500 mt-0.5" />
                <p className="text-xs font-semibold text-gray-600">
                  {deliveryAddress?.text}
                </p>
              </div>
            </div>
          </div>

          {/* ITEMS */}
          <div className="p-4 sm:p-5">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
              Order Details
            </h3>

            <div className="space-y-4">
              {myShopOrder.shopItems?.map((item, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[44px_1fr_auto] sm:grid-cols-[50px_1fr_auto] gap-3 items-center"
                >
                  <img
                    src={item.image || item.item?.image}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg object-cover bg-gray-100"
                    alt=""
                  />
                  <div className="min-w-0">
                    <p className="text-sm sm:text-base font-bold truncate">
                      {item.name}
                    </p>
                    <p className="text-xs font-bold text-orange-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="font-black">
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SECTION – ACTIONS */}
        <div className="bg-gray-900 p-4 sm:p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-gray-500 uppercase">
              Update Progress
            </label>

            <div className="relative">
              <select
                value={localStatus}
                onChange={(e) =>
                  handleChange(order._id, myShopOrder.shop._id, e.target.value)
                }
                className="w-full bg-gray-800 text-white text-sm font-bold py-3 px-4 rounded-xl border border-gray-700 appearance-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="pending">Pending</option>
                <option value="preparing">Preparing</option>
                <option value="out for delivery">Out for Delivery</option>
              </select>
              <ChevronRight
                size={18}
                className="absolute right-3 top-3.5 rotate-90 text-gray-500"
              />
            </div>

            <div className="border-t border-gray-800 pt-4">
              <p className="text-[9px] text-gray-500 font-bold uppercase">
                Via {paymentMethod}
              </p>
              <p className="text-3xl font-black text-white">
                ₹{myShopOrder.subTotal}
              </p>
            </div>
          </div>

          {/* DELIVERY BOYS */}
          {localStatus === "out for delivery" && (
            <div className="mt-6">
              <h4 className="text-[10px] font-bold text-orange-400 uppercase mb-2">
                Available Delivery Boys
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availableBoys.map((boy) => (
                  <button
                    key={boy.id}
                    className="flex justify-between items-center p-3 rounded-xl bg-gray-800 border border-gray-700"
                  >
                    <div className="text-left">
                      <p className="text-sm font-bold text-white">{boy.name}</p>
                      <p className="text-[11px] text-gray-400">{boy.mobile}</p>
                    </div>
                    <span className="text-[10px] font-black bg-orange-600 text-white px-3 py-1 rounded-full">
                      available
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {myShopOrder.assignedTo && (
            <div className="mt-3 bg-green-100 p-2 rounded-lg">
              <p className="text-xs font-bold text-green-700">
                Assigned to: {myShopOrder.assignedTo.fullName}
              </p>
              <p className="text-xs text-green-600">
                {myShopOrder.assignedTo.mobile}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerOrderCard;
