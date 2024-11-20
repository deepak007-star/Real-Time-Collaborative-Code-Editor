import { createSlice } from "@reduxjs/toolkit";
 
const roomSlice = createSlice({
    name:'room',
    initialState:{
        currentRoom:null,
        rooms:[],
        version:[],
        users:[],
    },
    reducers:{
        setRoomData:(state,action)=>{
            state.currentRoom = action.payload.room;
            state.version=action.payload.version;
            state.users = action.payload.users
        },
        addVersion:(state,action)=>{
            state.version.push(action.payload)
        },
        leaveRoom:(state, action)=>{
            state.rooms = state.rooms.filter(room=>room.roomId != action.payload)
            if(state.currentRoom){
                state.currentRoom = null
                state.version = null
            }
        },
        clearRoomState: (state) => {
            state.currentRoom = null;
            state.rooms = [];
            state.version = [];
            state.users = [];
        },
    }
})

export const {setRoomData, addVersion, leaveRoom} = roomSlice.actions;
export default roomSlice.reducer;
