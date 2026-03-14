import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, Utensils } from "lucide-react";
import useGetCity from "../hooks/useGetCity";
import axios from "axios";
import { setMyShopData } from "../redux/ownerSlice";


const CreateEditShop = () => {
  useGetCity();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { myShopData } = useSelector((state) => state.owner);
  const user = useSelector((state) => state.user);
  const [imagePreview, setImagePreview] = useState(myShopData?.image || null);

  const [formData, setFormData] = useState({
    name: myShopData?.name || " ",
    city: myShopData?.city || user?.currentCity,
    state: myShopData?.state || user?.currentState,
    address: myShopData?.address || user?.currentAddress,
    image: null,
  });

  const onChangeHandler = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      if (file) {
        setFormData((prev) => ({ ...prev, image: file }));
        setImagePreview(URL.createObjectURL(file)); // This creates the frontend preview
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("city", formData.city);
    data.append("state", formData.state);
    data.append("address", formData.address);

    // Only append image if a new one was selected
    if (formData.image) {
      data.append("image", formData.image);
    }
    try {
        const result = await axios.post("http://localhost:8000/api/shop/create-edit",data,{withCredentials:true});

        dispatch(setMyShopData(result.data));
        navigate("/")

    } catch (error) {
        console.log(error.message)
    }
  };

  return (
    <div className="flex justify-center flex-col items-center p-6 bg-linear-to-br from-orange-50 to-white min-h-screen relative">
      {/* Back Button */}
      <div
        className="absolute top-5 left-5 z-10 cursor-pointer p-2 hover:bg-orange-100 rounded-full transition-all"
        onClick={() => navigate("/")}
      >
        <ArrowLeft size={32} className="text-[#ff4d2d]" />
      </div>

      {/* Form Container */}
      <div className="max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 border border-orange-100 my-10">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-orange-100 p-4 rounded-full mb-4">
            <Utensils className="text-[#ff4d2d] w-12 h-12" />
          </div>
          <div className="text-3xl font-extrabold text-gray-900">
            {myShopData ? "Edit Shop" : "Add Shop"}
          </div>
        </div>

        {/* Integrated Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Shop Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shop Name
            </label>
            <input
              type="text"
              placeholder="Enter Shop Name"
              name="name"
              value={formData.name}
              onChange={onChangeHandler}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
            />
          </div>

          {/* Shop Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shop Image
            </label>
            <input
              type="file"
              accept="image/*"
              name="image"
              onChange={onChangeHandler}
              className="w-full px-4 py-2 border rounded-lg file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          {imagePreview && (
            <div className="w-full flex justify-center mb-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-48 h-48 object-cover rounded-xl border-2 border-orange-200 shadow-md"
              />
            </div>
          )}

          {/* City & State Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                placeholder="City"
                name="city"
                value={formData.city}
                onChange={onChangeHandler}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                placeholder="State"
                name="state"
                value={formData.state}
                onChange={onChangeHandler}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shop Address
            </label>
            <textarea
              placeholder="Enter Shop Address"
              name="address"
              value={formData.address}
              onChange={onChangeHandler}
              rows="3"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#ff4d2d] text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-orange-600 transition-all active:scale-95"
          >
            {myShopData ? "Update Details" : "Create Shop"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEditShop;
