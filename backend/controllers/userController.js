const User = require("../models/userModel");

const getCurrentUser = async (req,res)=>{
   
    try {
       const userId = req.userId;

        if(!userId) {
            return res.status(400).json({message:"userId not found"})
        }
        const user = await User.findById(userId);
        if(!user){
            return res.status(400).json({message:"user not found"})
        }
        return res.status(200).json(user);
    } catch (error) {
        
        return res.status(500).json({message:`get current user error ${error.message}`})
    }
}

const updateUserLocation = async (req, res) => {
  try {
    const { lat, lon } = req.body;

    if (
      typeof lat !== "number" ||
      typeof lon !== "number" ||
      lat < -90 || lat > 90 ||
      lon < -180 || lon > 180
    ) {
      return res.status(400).json({ message: "Invalid coordinates" });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        location: {
          type: "Point",
          coordinates: [lon, lat], 
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "User location updated successfully" });

  } catch (error) {
    return res
      .status(500)
      .json({ message: `User location update error: ${error.message}` });
  }
};

module.exports = {getCurrentUser,updateUserLocation};