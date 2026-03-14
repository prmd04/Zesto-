const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;


const generateToken = async (userId) =>{
  try{
    const token = await jwt.sign({userId},secret,{expiresIn:"7d"})
    return token;
  }
  catch(err){
    console.log(err);
  }
}
module.exports = generateToken;