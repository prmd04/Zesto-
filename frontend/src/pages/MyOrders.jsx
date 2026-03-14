import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UserOrderCard from "../components/UserOrderCard";
import OwnerOrderCard from "../components/OwnerOrderCard";
import { emptyCartItems} from "../redux/userSlice";

const MyOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData, myOrders} = useSelector((state) => state.user);
  
  return (
    <div className="min-h-screen w-7xl flex justify-start flex-col mx-auto bg-[#fff9f6]">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white shadow-sm mt-4">
        <ArrowLeft
          className="cursor-pointer"
          onClick={() => {
            dispatch(emptyCartItems());
            navigate("/user-dashboard");
          }}
        />
        <h1 className="text-lg font-semibold">My Orders</h1>
      </div>

      {/* Orders list */}
      <div className="p-4 space-y-4">
        {myOrders && myOrders.length > 0 ? (
          myOrders.map((order) =>
            userData.role === "user" ? (
              <UserOrderCard key={order._id} order={order} />
            ) : (
              <OwnerOrderCard key={order._id} order={order} />
            ),
          )
        ) : (
          <p className="text-center text-gray-500 mt-10">No orders found</p>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
