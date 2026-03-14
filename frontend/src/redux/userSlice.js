import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    currentCity: null,
    currentState: null,
    currentAddress: null,
    loading: true,
    shopInMyCity: null,
    itemInMyCity: null,
    cartItems: [],
    totalAmount: null,
    myOrders: [],
    searchItems:[],
    searchText:"",
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
      state.loading = false;
    },
    currentCity: (state, action) => {
      state.currentCity = action.payload;
    },
    currentState: (state, action) => {
      state.currentState = action.payload;
    },
    currentAddress: (state, action) => {
      state.currentAddress = action.payload;
    },
    logoutUser: (state, action) => {
      state.userData = null;
      state.userCity = null;
      state.loading = false;
    },
    setShopInMyCity: (state, action) => {
      state.shopInMyCity = action.payload;
    },
    setItemInMyCity: (state, action) => {
      state.itemInMyCity = action.payload;
    },
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.cartItems.find(
        (item) => item.id === newItem.id,
      );

      if (existingItem) {
        existingItem.quantity += newItem.quantity || 1;
      } else {
        state.cartItems.push(newItem);
      }

      state.totalAmount = state.cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === id);

      if (existingItem) {
        // ensuring it doesn't go below 1
        existingItem.quantity = Math.max(1, quantity);
      }
      state.totalAmount = state.cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
    },
    removeItem: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== action.payload,
      );
      state.totalAmount = state.cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
    },
    emptyCartItems: (state, action) => {
      state.cartItems = [];
    },
    setMyOrders:(state,action)=>{
      state.myOrders=action.payload
    },
    addNewOrder:(state,action)=>{
      state.myOrders=[action.payload,...state.myOrders]
    },
    setSearchItems:(state,action)=>{
      state.searchItems=action.payload
    },
    setSearchText:(state,action)=>{
      state.searchText=action.payload
    }
  }
});

export const {
  setUserData,
  currentCity,
  currentState,
  currentAddress,
  logoutUser,
  setShopInMyCity,
  setItemInMyCity,
  addToCart,
  updateQuantity,
  removeItem,
  setMyOrders,
  addNewOrder,
  emptyCartItems,
  setSearchItems,
  setSearchText,
} = userSlice.actions;
export default userSlice.reducer;
