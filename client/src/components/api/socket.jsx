const {io} = require('socket.io-client')

const socket = io('ws://localhost:3000/', {
    auth: localStorage.getItem('token')
})

export socket.on('connect-error', (err)=>{
    console.error(err.messge);
})
export default socket;