import axios from 'axios'

const URL = 'http://localhost:3000/api';
const api = axios.create({
    baseURL:URL,
})

api.interceptors.request.use((config)=>{
    const token = localStorage.getItem('token')
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;

})
export const register = async(email, name, password)=>{
    try {
        const response = await api.post(`/auth/register`, {email, name, password});
        return response.data
    } catch (error) {
        const errorMessage =
      error.response?.data?.message || error.response?.data || "Registration failed";
    throw new Error(errorMessage);
    }
}   
export const login = async(email, password)=>{
    try {
        const response =await axios.post(`${URL}/auth/login`, {email, password});
        return response.data;
    } catch (error) {
        const errorMessage =
      error.response?.data?.message || error.response?.data || "Login failed";
    throw new Error(errorMessage);
    }
}
export const createRoom = async(code)=>{
    try {
        const response = await api.post('create-room', {code})
        return response.data
    } catch (error) {
        console.log(`failed to create room ${error.message}`);
    }
}
export const joinRoom = async(roomId, code)=>{
    try {
        const response = await api.post(`${roomId}/join`, code) 
        return response.data
    } catch (error) {
        console.log(`failed to join room ${error.message}`);
    }
}
export const leaveRoom = async(roomId) =>{
    try {
        const response = await api.post(`${roomId}/leave`)
        return response.data
    } catch (error) {
        console.log(`failed to leave rooom ${error.message}`)
    }
}
export const userRoom = async()=>{
    try {
        const response = await api.get('user-rooms'); 
        return response.data;
    } catch (error) {
        console.log(`Failed to fetch user rooms: ${error.message}`);
    }
}
