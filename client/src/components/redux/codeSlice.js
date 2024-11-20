import { createSlice } from "@reduxjs/toolkit";

const codeSlice = createSlice({
    name:'code',
    initialState:{
        language:'c++',
        codeContent:'',
    },
    reducers:{
        setCodeContent:(state,action)=>{
            state.codeContent = action.payload
        },
        setLanguage:(state, action)=>{
            state.language = action.payload
        },
    }
})
export const {setCodeContent, setLanguage, updateCodeContent} = codeSlice.actions
export default codeSlice.reducer;