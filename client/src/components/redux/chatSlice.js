import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name:'chat',
    initialState:{
        messages:[]
    },
    reducers:{
        setMessage:(state, action)=>{
            state.messages = action.payload
        },
        addMessage:(state, action)=>{
            state.messages.push(action.payload);
        }
    }
})

export const {setMessage, addMessage} = chatSlice.actions;
export default chatSlice.reducer;