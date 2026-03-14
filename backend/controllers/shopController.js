const Shop = require("../models/shopModel");
const uploadOnCloudinary = require("../utils/cloudinary");

const createEditShop = async (req, res) => {
  try {
    const { name, city, state, address } = req.body;
    const userId = req.userId;

  
    if (!name || !address) {
      return res.status(400).json({ message: "Name and address are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Shop image is required" });
    }

    // Upload image to Cloudinary
    const imageUrl = await uploadOnCloudinary(req.file.path);
    if (!imageUrl) {
      return res.status(500).json({ message: "Image upload failed" });
    }

    // Check if shop already exists for this user
    let shop = await Shop.findOne({ owner: userId });

    if (!shop) {
      // CREATE new shop
      shop = await Shop.create({
        name,
        city,
        state,
        address,
        image: imageUrl, 
        owner: userId,
      });
    } else {
      // UPDATE existing shop
      const updateData = {
        name,
        city,
        state,
        address,
        image: imageUrl, 
      };

      shop = await Shop.findByIdAndUpdate(shop._id, updateData, { new: true });
    }

    // Populate owner and items if needed
    await shop.populate(["owner", "items"]);

    return res.status(201).json(shop);
  } catch (error) {
    console.error("create/edit shop error:", error);
    return res.status(500).json({ message: `create/edit shop error: ${error.message}` });
  }
};

const getMyShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.userId }).populate(["owner", "items"]);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    return res.status(200).json(shop);
  } catch (error) {
    console.error("get myshop error:", error);
    return res.status(500).json({ message: `get myshop error: ${error.message}` });
  }
};
const getCurrentShop = async(req,res)=>{
  try {
         const userId = req.userId;
          if(!userId) {
              return res.status(400).json({message:"userId not found"})
          }
          const shop = await Shop.findOne({owner:userId});
          await shop.populate("items")
          await shop.populate("owner")
          if(!shop){
              return res.status(400).json({message:"shop not found"})
          }
          return res.status(200).json(shop);
      } catch (error) {
          return res.status(500).json({message:`get current user error ${error.message}`})
      }
}

const getShopByCity = async (req, res) => {
  try {
    const { city } = req.params;

    // i is for case sensitivity
    const shops = await Shop.find({
      city: { $regex: new RegExp(city, "i") },
    }).populate("items");

    if (!shops ) {
      return res.status(404).json({ message: "No shops found in this city" });
    }

    return res.status(200).json(shops);
  } catch (error) {
    console.error("Error fetching shops:", error);
    return res.status(500).json({ 
      message: "Internal server error while fetching shops",
      error: error.message 
    });
  }
};

module.exports = { createEditShop, getMyShop , getCurrentShop , getShopByCity};
