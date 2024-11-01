import { createSlice } from "@reduxjs/toolkit";
import { version } from "react";
 
const roomSlice = createSlice({
    name:'room',
    initialState:{
        currentRoom:null,
        rooms:[],
        version:[],
    },
    reducers:{
        setRoomData:(state,action)=>{
            state.currentRoom = action.payload.room;
            state.version:action.payload.version;
        },
        addVersion:(state,action)=>{
            state.version.push(action.payload)
        }
    }
    
})