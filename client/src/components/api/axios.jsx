import axios from 'axios'

const api = axios.create({
    baseURL:'http://localhost:3000/',
})

api.interceptors.request.use((config)=>{
    const token = localStorage.getItem('token')
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
})

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
