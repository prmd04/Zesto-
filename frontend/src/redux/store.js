import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import ownerReducer from './ownerSlice';
import mapReducer from './mapSlice';

export default configureStore({
  reducer: {
    user: userReducer,
    owner:ownerReducer,
    map:mapReducer
  },
});
