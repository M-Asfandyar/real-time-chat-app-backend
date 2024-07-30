const express = require('express');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const User = require('./models/User');
const Message = require('./models/Message');
const multer = require('multer');
const path = require('path');
const redis = require('redis');
const session = require('express-session');
const RedisStore = require('connect-redis').default;

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();
app.use(express.json());

const redisClient = redis.createClient();
redisClient.on('error', (err) => {
    console.error('Redis error: ', err);
});

app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: false,
}));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/api/upload', upload.single('file'), (req, res) => {
    res.status(200).json({ filePath: `/uploads/${req.file.filename}` });
});

app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
    res.send('API is running...');
});

io.on('connection', (socket) => {
    console.log('New WebSocket connection');

    socket.on('joinRoom', async ({ userId, roomId }) => {
        const user = await User.findById(userId);
        user.status = 'online';
        user.socketId = socket.id;
        await user.save();
        socket.join(roomId);
        io.to(roomId).emit('userStatus', { userId, status: 'online' });

        const offlineMessages = await Message.find({ chatRoom: roomId, isOffline: true });
        offlineMessages.forEach((message) => {
            io.to(roomId).emit('message', message);
            message.isOffline = false;
            message.save();
        });
    });

    socket.on('sendMessage', async ({ userId, roomId, content, file }) => {
        const message = new Message({ sender: userId, chatRoom: roomId, content, file });
        const user = await User.findById(userId);
        if (user.status === 'offline') {
            message.isOffline = true;
        }
        await message.save();
        io.to(roomId).emit('message', message);
    });

    socket.on('typing', ({ userId, roomId, isTyping }) => {
        io.to(roomId).emit('typing', { userId, isTyping });
    });

    socket.on('disconnect', async () => {
        const user = await User.findOne({ socketId: socket.id });
        if (user) {
            user.status = 'offline';
            await user.save();
            io.emit('userStatus', { userId: user._id, status: 'offline' });
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
