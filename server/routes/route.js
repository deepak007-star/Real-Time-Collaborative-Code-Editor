const express = require('express')
const router = express.Router();
const {register, login} = require('../controllers/user');
const { createRoom, joinRoom, leaveRoom, userRoom, roomDetails } = require('../controllers/room');
const authentication = require('../middleware/authRoute');
// const { sendMessage, getMessage } = require('../controllers/message');
const asyncWrapper = require('../middleware/asyncWrapper');

router.route('/auth/register').post(register)
router.route('/auth/login').post(login)

router.route('/create-room').post(asyncWrapper, authentication,createRoom)
router.route('/join/:roomId').post(asyncWrapper, authentication, joinRoom)
// router.route('/reJoin/:roomId').post(asyncWrapper, authentication,reJoinRoom )
router.route('/leave/:roomId').post(asyncWrapper, authentication, leaveRoom)
router.route('/user/rooms').get(asyncWrapper, authentication,userRoom)
router.route('/user/room/:id').get(asyncWrapper, authentication, roomDetails)

module.exports = router;