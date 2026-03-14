import { createSlice } from "@reduxjs/toolkit";

const mapSlice = createSlice({
    name:"map",
    initialState:{
        location:{
            long:null,
            lat:null,
        },
        address:null
    },
    reducers : {
        setLocation :(state,action)=>{
            const{long,lat}=action.payload;
            state.location.long=long;
            state.location.lat=lat;
        },
        setAddress : (state,action)=>{
            state.address = action.payload
        }
    }
})

export const {setLocation,setAddress}=mapSlice.actions;
export default mapSlice.reducer;