const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDb = require("./config/db");

const authRouter = require("./Routes/Authrouter");
const userRouter = require("./Routes/Userrouter");
const shopRouter = require("./Routes/Shoprouter");
const itemRouter = require("./Routes/Itemrouter");
const orderRouter = require("./Routes/Orderrouter");

const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter);
app.use("/api/item", itemRouter);
app.use("/api/order", orderRouter);

const startApp = async () => {
  try {
    await connectDb();
    console.log("Database connected");

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.log("Startup error:", error);
  }
};

startApp();