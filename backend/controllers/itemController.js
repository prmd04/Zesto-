const Shop = require("../models/shopModel");
const Item = require("../models/itemModel");
const uploadOnCloudinary = require("../utils/cloudinary");

const addItem = async (req, res) => {
  try {
    const { name, category, foodtype, price } = req.body;

    let imageUrl;
    if (req.file) {
      imageUrl = await uploadOnCloudinary(req.file.path);
    }
    const shop = await Shop.findOne({ owner: req.userId });

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const item = await Item.create({
      name,
      category,
      foodtype,
      price,
      image: imageUrl,
      shop: shop._id,
    });

    shop.items.push(item._id);
    await shop.save();
    await shop.populate("items");
    await shop.populate("owner");
    return res.status(201).json(shop);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Item create error: ${error.message}` });
  }
};

const editItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, foodtype, price } = req.body;

    let imageUrl;
    if (req.file) {
      imageUrl = await uploadOnCloudinary(req.file.path);
    }

    const updateData = {
      name,
      category,
      foodtype,
      price,
    };

    if (imageUrl) {
      updateData.image = imageUrl;
    }

    const item = await Item.findByIdAndUpdate(id, updateData, { new: true });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    const shop = await Shop.findOne({ owner: req.userId });
    await shop.populate("items");
    return res.status(200).json(shop);
  } catch (error) {
    return res.status(500).json({
      message: `Item update error: ${error.message}`,
    });
  }
};

const getItemById = async (req, res) => {
  const { itemId } = req.params;
  console.log(itemId);
  try {
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    return res.status(200).json(item);
  } catch (err) {
    return res.status(500).json({
      message: `Item update error: ${err.message}`,
    });
  }
};

const deleteItem = async (req, res) => {
  const { itemId } = req.params;
  try {
    const item = await Item.findByIdAndDelete(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    const shop = await Shop.findOneAndUpdate(
      { owner: req.userId },
      { $pull: { items: itemId } },
      { new: true },
    );
    await shop.populate("items");

    return res.status(200).json(shop);
  } catch (error) {
    return res.status(500).json({
      message: `Item update error: ${error.message}`,
    });
  }
};

const getItemByCity = async (req, res) => {
  try {
    const { city } = req.params;

    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }

    // 1. Find all shops in the specified city
    const shops = await Shop.find({
      city: { $regex: new RegExp(`^${city}$`, "i") },
    });

    // 2. Check if any shops were found
    if (!shops) {
      return res.status(404).json({ message: "No shops found in this city" });
    }

    // 3. Extract all Shop IDs
    const shopIds = shops.map((shop) => shop._id);

    // 4. Find all items belonging to those shops
    const items = await Item.find({ shop: { $in: shopIds } }).populate("shop");

    return res.status(200).json(items);
  } catch (error) {
    console.error("Error in getItemByCity:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
const getItemByShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    console.log(shopId);

    const shop = await Shop.findById(shopId).populate("items");
    if (!shop) {
      return res.status(404).json({ message: "shop not found" });
    }
    return res.status(200).json({
      shop,
      items: shop.items,
    });
  } catch (error) {
    return res.status(500).json({
      message: `can not find shopItem: ${error.message}`,
    });
  }
};

const searchItems = async (req, res) => {
  try {
    const { query, city } = req.query;

    if (!query || !city) {
      return res.status(400).json({
        message: "query and city are required",
      });
    }

    const shops = await Shop.find({
      city: { $regex: city, $options: "i" },
    });

    if (shops.length === 0) {
      return res.status(404).json({
        message: "No shops found in this city",
      });
    }

    const shopIds = shops.map((shop) => shop._id);

    const items = await Item.find({
      shop: { $in: shopIds },
      $or: [
        { name: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    }).populate("shop", "name image");

    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({
      message: `Cannot search items: ${error.message}`,
    });
  }
};

module.exports = {
  addItem,
  editItem,
  getItemById,
  deleteItem,
  getItemByCity,
  getItemByShop,
  searchItems
};
