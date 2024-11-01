import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:'auth',
    initialState:{
        user:null,
        isAuthenticated: false,
        token:null,
    },
    reducers:{
        login(state, action){
            state.user = action.payload.user;
            state.token=action.payload.token;
            state.isAuthenticated = true
        },
        logOut(state){
            state.user = null;
            state.token = null;
            state.isAuthenticated = false
        }
    }
})

export const {login, logOut} = authSlice.actions;
export default authSlice.reducer;