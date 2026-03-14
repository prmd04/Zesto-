import React, { useEffect,useRef } from "react";
import { Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp.jsx";
import SignIn from "./pages/SignIn.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import useGetCurrentUser from "./hooks/useGetCurrentUser.jsx";
import Loader from "./components/Loader.jsx";
import UserDashboard from "./components/UserDashBoard.jsx";
import OwnerDashboard from "./components/OwnerDashboard.jsx";
import CreateEditShop from "./pages/CreateEditShop.jsx";
import AddFoodItem from "./pages/AddFoodItem.jsx";
import EditFoodItem from "./pages/EditFoodItem.jsx";
import useGetShopByCity from "./hooks/useGetShopByCity.jsx";
import useGetItemByCity from "./hooks/useGetItemByCity.jsx";
import CartPage from "./pages/CartPage.jsx";
import CheckOut from "./pages/CheckOut.jsx";
import OrderPlaced from "./pages/OrderPlace.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import useGetMyOrders from "./hooks/useGetMyOrders.jsx";
import useUpdateLocation from "./hooks/useUpdateLocation.jsx";
import DeliveryBoyDashboard from "./components/DeliveryBoyDashboard.jsx";
import TrackOrder from "./pages/TrackOrder.jsx";
import Shop from "./pages/Shop.jsx";

function App() {
  const serverURL = "http://localhost:8000";
  const socketRef = useRef(null);
  const dispatch = useDispatch();
  useGetCurrentUser();
  useGetShopByCity();
  useGetItemByCity();
  useGetMyOrders();
  useUpdateLocation();
  const { userData, loading } = useSelector((state) => state.user);

  if (loading) {
    return <Loader />;
  }

  // Helper function to determine where to send a logged-in user
  const getDashboard = () => {
    if (userData?.role === "owner") return <OwnerDashboard />;
    if (userData?.role === "user") return <UserDashboard />;
    if (userData?.role === "deliveryBoy") return <DeliveryBoyDashboard />;
  };

  return (
    <Routes>
      {/* Auth Routes: Redirect to home if already logged in */}
      <Route
        path="/signup"
        element={!userData ? <SignUp /> : <Navigate to="/" replace />}
      />
      <Route
        path="/signin"
        element={!userData ? <SignIn /> : <Navigate to="/" replace />}
      />
      <Route
        path="/forgotpassword"
        element={!userData ? <ForgotPassword /> : <Navigate to="/" replace />}
      />

      {/* Main Route: Logic for Role-based Dashboard */}
      <Route
        path="/"
        element={userData ? getDashboard() : <Navigate to="/signup" replace />}
      />

      {/* Optional: Add specific paths if you want direct access */}
      <Route
        path="/user-dashboard"
        element={
          userData?.role === "user" ? <UserDashboard /> : <Navigate to="/" />
        }
      />
      <Route
        path="/owner-dashboard"
        element={
          userData?.role === "owner" ? <OwnerDashboard /> : <Navigate to="/" />
        }
      />
      <Route
        path="/create-edit-shop"
        element={userData ? <CreateEditShop /> : <Navigate to={"/signup"} />}
      />
      <Route
        path="/addfooditem"
        element={userData ? <AddFoodItem /> : <Navigate to={"/signup"} />}
      />
      <Route
        path="/editfooditem/:itemId"
        element={userData ? <EditFoodItem /> : <Navigate to={"/signup"} />}
      />
      <Route
        path="/cartPage"
        element={userData ? <CartPage /> : <Navigate to={"/signup"} />}
      />
      <Route
        path="/checkout"
        element={userData ? <CheckOut /> : <Navigate to={"/signup"} />}
      />
      <Route
        path="/orderplaced"
        element={userData ? <OrderPlaced /> : <Navigate to={"/signup"} />}
      />
      <Route
        path="/myorders"
        element={userData ? <MyOrders /> : <Navigate to={"/signup"} />}
      />
      <Route
        path="/trackorder/:orderId"
        element={userData ? <TrackOrder /> : <Navigate to={"/signup"} />}
      />
      <Route
        path="/shop/:shopId"
        element={userData ? <Shop /> : <Navigate to={"/signup"} />}
      />
    </Routes>
  );
}

export default App;
