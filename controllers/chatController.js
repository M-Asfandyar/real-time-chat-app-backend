
const ChatRoom = require('../models/ChatRoom');
const Message = require('../models/Message');

// Get all chat rooms
const getChatRooms = async (req, res) => {
    try {
        const chatRooms = await ChatRoom.find().populate('users', 'username');
        res.status(200).json(chatRooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new chat room
const createChatRoom = async (req, res) => {
    const { name } = req.body;
    try {
        const chatRoom = new ChatRoom({ name });
        await chatRoom.save();
        res.status(201).json(chatRoom);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get messages for a specific chat room
const getMessages = async (req, res) => {
    const { chatRoomId } = req.params;
    try {
        const messages = await Message.find({ chatRoom: chatRoomId }).populate('sender', 'username');
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



module.exports = { getChatRooms, createChatRoom, getMessages };
