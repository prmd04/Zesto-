import { createSlice } from "@reduxjs/toolkit";

const ownerSlice = createSlice({
  name: "owner",
  initialState: {
    myShopData: null,
    loading: true,
    pendingOrders:0
  },
  reducers: {
    setMyShopData: (state, action) => {
      state.myShopData = action.payload;
      state.loading = false;
    },
    clearShopData: (state,action)=>{
      state.myShopData=null;
      state.loading=false;
    },
    incrementPendingOrders:(state)=>{
      state.pendingOrders +=1;
    },
  },
});

export const {setMyShopData,clearShopData,incrementPendingOrders} = ownerSlice.actions;
export default ownerSlice.reducer;
