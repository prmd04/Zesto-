import React, { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  ShoppingCart,
  Menu,
  UtensilsCrossed,
  LogOut,
  ChevronDown,
  X,
  Clock,
  Plus,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { logoutUser, setSearchItems, setSearchText} from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import useGetCity from "../hooks/useGetCity";
const serverURL = import.meta.env.VITE_SERVER_URL;


const Navbar = () => {
  useGetCity();

  const user = useSelector((state) => state.user);
  const { myShopData } = useSelector((state) => state.owner);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const role = user?.userData?.role;
  const isUser = role === "user";
  const isOwner = role === "owner";

  const firstLetter = user?.userData?.fullName?.charAt(0) || "U";
  const fullName = user?.userData?.fullName || "User";
  const city = user?.currentCity || "Searching...";

  const handleLogout = async () => {
    try {
      await axios.get(`${serverURL}/api/auth/signout`, {
        withCredentials: true,
      });
      dispatch(logoutUser());
      navigate("/signup", { replace: true });
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleSearchItems = async () => {
    try {
      const res = await axios.get(
        `${serverURL}/api/item/searchitems?query=${query}&city=${city}`,
        { withCredentials: true },
      );
      dispatch(setSearchItems(res.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    dispatch(setSearchText(query));
    if (query) {
      handleSearchItems();
    }
    else{
      dispatch(setSearchItems(null));
    }
  }, [query]);
  return (
    <>
      {/* ======= NAVBAR ======= */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-20 items-center justify-between">
            {/* Logo + Location */}
            <div className="flex items-center gap-5 shrink-0">
              <div className="bg-orange-600 p-2 rounded-lg">
                <UtensilsCrossed className="text-white w-5 h-5" />
              </div>
              <h1
                className="text-xl sm:text-2xl font-black text-orange-600 cursor-pointer"
                onClick={() => navigate("/")}
              >
                ZESTO
              </h1>

              <div className="hidden sm:flex items-center gap-1 border-l pl-3">
                <MapPin size={14} className="text-red-500" />
                <span className="text-sm font-bold text-gray-600">{city}</span>
              </div>
            </div>

            {/* Desktop Search (user only) */}
            {isUser && (
              <div className="hidden lg:block flex-1 max-w-md mx-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search food..."
                    value={query}
                    className="w-full py-2.5 pl-10 pr-4 bg-gray-100 rounded-xl text-sm focus:outline-none focus:bg-white border border-transparent focus:border-orange-500"
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <Search
                    size={16}
                    className="absolute left-3 top-3 text-gray-400"
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4 lg:gap-8">
              {/* Desktop User Only Actions */}
              {isUser && (
                <>
                  <button
                    onClick={() => navigate("/myorders")}
                    className="hidden lg:flex items-center gap-2 font-bold text-sm text-gray-700 hover:text-orange-600 cursor-pointer"
                  >
                    My Orders
                  </button>
                  <div
                    className="relative cursor-pointer"
                    onClick={() => navigate("/cartPage")}
                  >
                    <ShoppingCart size={22} className="text-gray-700" />
                    <span className="absolute -top-3 -right-3 h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                      {user?.cartItems?.length || 0}
                    </span>
                  </div>
                </>
              )}

              {/* Desktop Owner Only Actions */}
              {isOwner && (
                <div className="hidden lg:flex items-center gap-3">
                  {myShopData && (
                    <button
                      onClick={() => navigate("/addfooditem")}
                      className="flex items-center gap-2 p-3 rounded-xl bg-orange-50 text-orange-600 font-bold hover:bg-orange-100"
                    >
                      <Plus size={18} />
                      <span className="text-sm font-semibold">Add Item</span>
                    </button>
                  )}

                  <button
                    onClick={() => navigate("/myorders")}
                    className="relative flex items-center gap-2 p-3 rounded-xl bg-gray-50 text-gray-700 font-bold hover:bg-gray-100"
                  >
                    <Clock size={18} className="text-orange-500" />
                    <span className="text-sm font-semibold">My Orders</span>
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-[12px] flex items-center justify-center">
                      !
                    </span>
                  </button>
                </div>
              )}

              {/* Profile Dropdown (Desktop) */}
              <div className="hidden lg:block relative">
                <button
                  onClick={() => setShowDropdown((prev) => !prev)}
                  className="flex items-center gap-1"
                >
                  <div className="w-9 h-9 rounded-full bg-linear-to-br from-orange-400 to-orange-600 text-white font-bold flex items-center justify-center cursor-pointer">
                    {firstLetter.toUpperCase()}
                  </div>
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${showDropdown ? "rotate-180" : ""}`}
                  />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-3 w-48 bg-white border rounded-xl shadow-lg py-2 overflow-hidden">
                    <div className="px-4 py-2 border-b">
                      <p className="font-bold text-gray-800 truncate">
                        {fullName}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{role}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 flex items-center gap-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle (Fixed Breakpoint) */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className="lg:hidden p-1"
              >
                <Menu size={28} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ======= MOBILE SEARCH (user only) ======= */}
      {isUser && (
        <div className="lg:hidden bg-white px-4 pb-3 shadow-sm">
          <div className="relative">
            <input
              type="text"
              placeholder="Search food..."
              value={query}
              onChange={(e)=>setQuery(e.target.value)}
              className="w-full py-2.5 pl-10 pr-4 bg-gray-100 rounded-xl text-sm focus:outline-none focus:bg-white border border-transparent focus:border-orange-500"
            />
            <Search
              size={16}
              className="absolute left-3 top-3.5 text-gray-400"
            />
          </div>
        </div>
      )}

      {/* ======= MOBILE DRAWER OVERLAY ======= */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* ======= MOBILE DRAWER CONTENT ======= */}
      <div
        className={`fixed top-0 right-0 h-full w-[75%] max-w-xs bg-white z-70 shadow-2xl transform transition-transform duration-300 lg:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-black text-orange-600">ZESTO</h2>
            <button onClick={() => setIsMenuOpen(false)}>
              <X size={22} />
            </button>
          </div>

          <div className="flex items-center gap-3 bg-orange-50 p-4 rounded-xl mb-6">
            <div className="w-12 h-12 rounded-full bg-orange-600 text-white font-bold flex items-center justify-center text-lg">
              {firstLetter}
            </div>
            <div>
              <p className="font-bold text-gray-800">{fullName}</p>
              <p className="text-xs text-orange-600 capitalize">{role}</p>
            </div>
          </div>

          {(isUser || isOwner) && (
            <div className="space-y-2">
              <button
                onClick={() => {
                  navigate("/myorders");
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 font-bold text-gray-700"
              >
                <Clock size={20} className="text-orange-500" />
                My Orders
                <span className="ml-auto bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">
                  !
                </span>
              </button>

              {/* Owner Specific - Add Item */}
              {isOwner && myShopData && (
                <button
                  onClick={() => {
                    navigate("/addfooditem");
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 font-bold text-gray-700"
                >
                  <Plus size={20} className="text-orange-500" />
                  Add New Item
                </button>
              )}
            </div>
          )}

          <button
            onClick={handleLogout}
            className="mt-auto flex items-center justify-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors"
          >
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
