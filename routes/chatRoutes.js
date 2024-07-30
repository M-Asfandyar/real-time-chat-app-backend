

const express = require('express');
const { getChatRooms, createChatRoom, getMessages } = require('../controllers/chatController');
const router = express.Router();

router.get('/rooms', getChatRooms);
router.post('/rooms', createChatRoom);
router.get('/messages/:chatRoomId', getMessages);

module.exports = router;
