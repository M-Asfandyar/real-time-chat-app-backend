const mongoose = require('mongoose');

const messageSchema = mongoose.Schema(
    {
        content: { type: String, required: true },
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        chatRoom: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom', required: true },
        timestamp: { type: Date, default: Date.now },
        isOffline: { type: Boolean, default: false },
        reactions: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                emoji: { type: String },
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
