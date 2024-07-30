const mongoose = require('mongoose');

const chatRoomSchema = mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    },
    {
        timestamps: true,
    }
);

const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);

module.exports = ChatRoom;
