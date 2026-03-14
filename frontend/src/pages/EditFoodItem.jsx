import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, UtensilsCrossed, IndianRupee } from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { setMyShopData } from "../redux/ownerSlice";
import Loader from "../components/Loader";
const serverURL = import.meta.env.VITE_SERVER_URL;

const EditFoodItem = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { myShopData } = useSelector((state) => state.owner);
  
  const [currentItem, setCurrentItem] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Others",
    foodtype: "veg",
    image: null,
  });

  const categories = [
    "Snacks", "Main Course", "Desserts", "Pizza", "Burgers",
    "Sandwiches", "South Indian", "North Indian", "Chinese",
    "Fast Food", "Others",
  ];

  useEffect(() => {
    const fetchItem = async () => {
      if (!itemId) return;
      
      try {
        const result = await axios.get(
          `${serverURL}/api/item/getitembyid/${itemId}`,
          { withCredentials: true }
        );
        setCurrentItem(result.data);
      } catch (error) {
        toast.error("Error loading item data");
      }
    };
    fetchItem();
  }, [itemId]);

  useEffect(() => {
    if (currentItem) {
      setFormData({
        name: currentItem.name || "",
        price: currentItem.price || "",
        category: currentItem.category || "Others",
        foodtype: currentItem.foodtype || "veg",
        image: currentItem.image,
      });
      setImagePreview(currentItem.image);
    }
  }, [currentItem]);

  const onChangeHandler = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      if (file) {
        setFormData((prev) => ({ ...prev, image: file }));
        setImagePreview(URL.createObjectURL(file));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("foodtype", formData.foodtype);
    data.append("shop", myShopData._id);
    if (formData.image) data.append("image", formData.image);

    try {
      
      const res = await axios.post(
        `${serverURL}/api/item/edititem/${itemId}`,
        data,
        { withCredentials: true }
      );
      toast.success("Item updated successfully!");
      dispatch(setMyShopData(res.data));
      setLoading(false);
      navigate("/")
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Failed to update item");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="flex justify-center flex-col items-center p-6 bg-linear-to-br from-orange-50 to-white min-h-screen relative">
      <Toaster />
      <div
        className="absolute top-5 left-5 z-10 cursor-pointer p-2 hover:bg-orange-100 rounded-full transition-all"
        onClick={() => navigate("/")}
      >
        <ArrowLeft size={28} className="text-[#ff4d2d]" />
      </div>

      <div className="max-w-md w-full bg-white shadow-2xl rounded-3xl p-8 border border-orange-100 my-10">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-orange-500 p-4 rounded-2xl shadow-lg shadow-orange-200 mb-4">
            <UtensilsCrossed className="text-white w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">
            Edit Food Item
          </h2>
          <p className="text-gray-400 text-sm">Update the details of your dish</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-col items-center">
            <div className="w-full h-40 mb-3 relative rounded-2xl border-2 border-dashed border-orange-200 overflow-hidden bg-orange-50 flex items-center justify-center">
              {imagePreview ? (
                <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <div className="text-center">
                  <p className="text-orange-400 text-xs font-medium">Click below to change image</p>
                </div>
              )}
            </div>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={onChangeHandler}
              className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Dish Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={onChangeHandler}
              className="w-full px-4 py-3 bg-gray-50 border-transparent focus:border-orange-500 focus:bg-white border-2 rounded-xl transition-all outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Price</label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
                <input
                  type="number"
                  name="price"
                  required
                  value={formData.price}
                  onChange={onChangeHandler}
                  className="w-full pl-9 pr-4 py-3 bg-gray-50 border-transparent focus:border-orange-500 focus:bg-white border-2 rounded-xl transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={onChangeHandler}
                className="w-full px-3 py-3 bg-gray-50 border-transparent focus:border-orange-500 focus:bg-white border-2 rounded-xl transition-all outline-none text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase ml-1 block mb-2">Food Type</label>
            <div className="flex gap-4">
              {["veg", "non veg"].map((type) => (
                <label key={type} className="flex-1">
                  <input
                    type="radio"
                    name="foodtype"
                    value={type}
                    checked={formData.foodtype === type}
                    onChange={onChangeHandler}
                    className="hidden peer"
                  />
                  <div className={`text-center py-2 rounded-xl border-2 cursor-pointer transition-all capitalize text-sm font-bold
                    ${type === "veg" 
                      ? "peer-checked:border-green-500 peer-checked:bg-green-50 text-green-600" 
                      : "peer-checked:border-red-500 peer-checked:bg-red-50 text-red-600"} 
                    border-gray-100 bg-gray-50 text-gray-400`}
                  >
                    {type}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#ff4d2d] text-white py-4 rounded-2xl font-black shadow-xl shadow-orange-200 hover:bg-orange-600 hover:-translate-y-1 transition-all active:scale-95 uppercase tracking-widest"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditFoodItem;