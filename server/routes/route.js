const express = require('express')
const router = express.Router();
const {register, login} = require('../controllers/user');
const { createRoom, joinRoom, leaveRoom, userRoom } = require('../controllers/room');
const authentication = require('../middleware/authRoute');
// const { sendMessage, getMessage } = require('../controllers/message');

router.route('/auth/register').post(register)
router.route('/auth/login').post(login)

router.route('/create-room').post(authentication,createRoom)
router.route('/:room/join').post(authentication, joinRoom)
router.route('/:roomId/leave').post(authentication, leaveRoom)
router.route('/:roomId/users').get(authentication,userRoom)

// router.route('/room').post(authentication, sendMessage)
// router.route('/:roomId').get(authentication, getMessage)
module.exports = router;