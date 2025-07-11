require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');
const redisClient = require('./redisClient');
const passport = require('passport');
require('./passport.config')(passport)
const http = require('http');
const { Server } = require('socket.io');
const Message = require('./models/Message');

const app = express();

const server = http.createServer(app);
const io = new Server(server);

// MongoDB connection
mongoose.connect("mongodb+srv://loedkign:3TMO9NDAp23fvPET@cluster.6vwdf0w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
  tlsInsecure: true
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// Express session setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: "mongodb+srv://loedkign:3TMO9NDAp23fvPET@cluster.6vwdf0w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster" }),
  cookie: { maxAge: 1000 * 60 * 60 * 24} // 1 day
}));

console.log(typeof passport);
console.log(passport.initialize);
//passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash messages
app.use(flash());

// Global flash middleware
app.use((req, res, next) => {
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');

  res.locals.user = null;
  if (req.user) {
    res.locals.user = {
      _id: req.session.userId,
      avatarUrl: req.session.avatarUrl,
      role: req.session.userRole
    };
  }
  next();
});

// Views and static files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method'));

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/admin', require('./routes/admin'));
app.use('/cities', require('./routes/cities'));
app.use('/countries', require('./routes/countries'));

// Socket.io for real-time chat/comments
io.on('connection', (socket) => {
  console.log('🟢 User connected:', socket.id);

  socket.on('joinRoom', (room) => {
    try {
      socket.join(room);
    } catch (err) {
      console.log('join room error:', err)
     }
  });

  socket.on("chatMessage", async ({ room, text, userName, avatarUrl }) => {
    try {
      const newMessage = new Message({
        cityId: room,
        senderName: userName,
        senderAvatar:avatarUrl,
        content: text,
        timestamp: new Date()
      });
      await newMessage.save();
      io.to(room).emit("chatMessage", {
        senderName: newMessage.senderName,
        senderAvatar: newMessage.senderAvatar,
        content: newMessage.content,
        timestamp: newMessage.timestamp
      });
    } catch (err) {
      console.error("Error saving message:", err);
    }
  })

  

  // socket.on('chatMessage', async (msgData) => {
  //  try {
  //   const newMsg = await Message.create(msgData);
  //   io.to(msgData.cityId).emit('message', newMsg);
  //  } catch (err) {
  //   console.log('chat message error:', err)
  //  }
  // });

  socket.on('typing', (data) => {
    socket.to(data.roomId).emit('typing', data.username);
  });

  socket.on('disconnect', () => {
    console.log('🔴 User disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

