import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import DeliveryBoyTracking from "../components/DeliveryBoyTracking";
const serverURL = import.meta.env.VITE_SERVER_URL;

const TrackOrder = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleGetOrder = async () => {
    try {
      const res = await axios.get(
        `${serverURL}/api/order/getorderbyid/${orderId}`,
        { withCredentials: true },
      );
      setOrder(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetOrder();
  }, [orderId]);

  useEffect(() => {
    if (!order) return;

    if (order.status !== "out for delivery") return;

    const interval = setInterval(() => {
      handleGetOrder();
    }, 5000);

    return () => clearInterval(interval);
  }, [order?.status]);

  if (loading) {
    return <div className="p-6">Loading order...</div>;
  }

  if (!order) {
    return <div className="p-6">Order not found.</div>;
  }

  const orderData = order?.shopOrders?.[0];

  // --------------------------
  // MAP LOGIC (SAFE VERSION)
  // --------------------------

  const deliveryBoyCoords = orderData?.assignedTo?.location?.coordinates;

  const customerLat = order?.deliveryAddress?.latitude;
  const customerLng = order?.deliveryAddress?.longitude;

  let mapData = null;

  if (
    orderData?.status === "out for delivery" &&
    deliveryBoyCoords &&
    deliveryBoyCoords.length === 2 &&
    customerLat &&
    customerLng
  ) {
    mapData = {
      deliveryBoyLocation: {
        lat: deliveryBoyCoords[1],
        lon: deliveryBoyCoords[0],
      },
      customerLocation: {
        lat: customerLat,
        lon: customerLng,
      },
    };
  }

  // console.log(mapData);

  return (
    <div className="min-h-screen w-3xl mx-auto bg-[#fff9f6] flex flex-col font-sans text-gray-800">
      {/* Top Navigation */}
      <div className="flex items-center gap-4 px-4 py-4 bg-white shadow-sm">
        <button
          className="p-1 cursor-pointer"
          onClick={() => navigate("/myorders")}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold">Track Order</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Shop Info */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-orange-500">
          <h2 className="text-2xl font-black text-orange-500 uppercase tracking-tight">
            {orderData?.shop?.name}
          </h2>
          <p className="text-green-800 text-xs font-bold uppercase mt-1">
            {orderData?.status}
          </p>
        </div>

        {/* Items */}
        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-widest">
            Items
          </h3>

          <div className="space-y-2">
            {orderData?.shopItems?.map((item) => (
              <div key={item._id} className="flex justify-between items-center">
                <p className="font-bold text-gray-700">
                  {item.quantity} x {item.name}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-dashed border-gray-200 flex justify-between items-center">
            <span className="font-medium text-gray-500">Subtotal</span>
            <span className="text-xl font-black text-gray-900">
              ₹{order?.totalAmount}
            </span>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <h3 className="text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">
            Delivery To
          </h3>
          <p className="text-sm font-semibold text-gray-800 leading-snug">
            {order?.deliveryAddress?.text}
          </p>
        </div>

        {/* Delivery Partner */}
        <div className="bg-white p-5 rounded-2xl shadow-sm flex justify-between items-center">
          <div>
            <h3 className="text-[10px] font-bold text-gray-400 uppercase mb-1">
              Delivery Partner
            </h3>

            <p className="font-bold text-gray-900">
              {orderData?.assignedTo?.fullName || "Assigning..."}
            </p>

            {orderData?.assignedTo?.mobile && (
              <p className="text-sm font-medium text-orange-600">
                {orderData?.assignedTo?.mobile}
              </p>
            )}
          </div>

          {orderData?.assignedTo?.mobile && (
            <a
              href={`tel:${orderData?.assignedTo?.mobile}`}
              className="bg-orange-100 p-3 rounded-full text-orange-600 active:scale-90 transition-transform"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </a>
          )}
        </div>

        {/* MAP SECTION */}
        {mapData ? (
          <DeliveryBoyTracking data={mapData} />
        ) : (
          orderData?.status === "out for delivery" && (
            <div className="bg-white p-5 rounded-2xl shadow-sm text-center text-gray-500">
              Waiting for delivery partner location...
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
