import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice'
import chatReducer from './chatSlice'
import codeReducer from './codeSlice'
import roomReducer  from './roomSlice'

const store = configureStore({
    reducer:{
        auth: authReducer,
        chat: chatReducer,
        code: codeReducer,
        room: roomReducer,
    }
})
export default store;