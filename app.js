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
//bad word filter
const leoProfanity = require("leo-profanity");
leoProfanity.add(leoProfanity.getDictionary('en'));
leoProfanity.add(["ashawo", "yawa", "olosho", "maga"]);

const checkSuspension = require('./middleware/checkSuspension');


const app = express();
const server = http.createServer(app);
const io = new Server(server);

// MongoDB connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
  tlsInsecure: true
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// Express session setup, mongo inclucive
app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl:process.env.MONGO_URL }),
  cookie: { maxAge: 1000 * 60 * 60 * 24} // 1 day
}));

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

// Views, static files and use states
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method'));

//Globally initializing Suspend middleware
app.use(checkSuspension);
// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/admin', require('./routes/admin'));
app.use('/cities', require('./routes/cities'));
app.use('/countries', require('./routes/countries'));

const nodemailer = require("nodemailer");
const muteDuration = 10 * 60 * 1000; // 10 minutes in milliseconds
const muteMap = new Map(); // { userId: timestamp }
const userInfractions = {}; // { userId: count }

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);
  const userId = socket.id;
  userInfractions[userId] = 0;

  socket.on("joinRoom", (room) => {
    try {
      socket.join(room);
    } catch (err) {
      console.log("join room error:", err);
    }
  });

  socket.on("chatMessage", async ({ room, text, userName, avatarUrl }) => {
    try {
      function logInfraction(userName, text) {
        // Save to DB if needed
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_TO || "lordkign3@gmail.com",
          subject: "Profanity Infraction Alert",
          html: `<p><strong>User:</strong> ${userName}</p>
                 <p><strong>Message:</strong> ${text}</p>
                 <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>`
        };
      
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) console.error("Email error:", err);
          else console.log("Infraction emailed:", info.response);
        });
      }
      // Setup transporter (e.g., Gmail)
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      // Check if muted
      if (muteMap.has(userId)) {
        const unmuteTime = muteMap.get(userId);
        const now = Date.now();
        if (now < unmuteTime) {
          const remaining = unmuteTime - now;
          socket.emit("mutedCountdown", Math.ceil(remaining / 1000));
          return;
        } else {
          muteMap.delete(userId); // Unmute
        }
      }
      // for later DB mute integration
     /*  if (mutedUntil && mutedUntil > Date.now()) {
        muteMap.set(userId, user.mutedUntil); // cache it
        socket.emit("mutedCountdown", Math.ceil((user.mutedUntil - Date.now()) / 1000));
        return;
      } */

      const isProfane = leoProfanity.check(text);
      const cleanText = isProfane ? leoProfanity.clean(text) : text;

      if (isProfane) {
        userInfractions[userId]++;

        const infractionCount = userInfractions[userId];

        if (infractionCount === 2) {
          socket.emit("warning", "⚠️ Please stop using foul language. One more and you’ll be muted for 10 minutes.");
        }

        if (infractionCount >= 3) {
          muteMap.set(userId, Date.now() + 10 * 60 * 1000); // 10 mins
          socket.emit("muted", "🚫 You’ve been muted for 10 minutes due to repeated profanity.");
          socket.emit("mutedCountdown", muteDuration / 1000); // Send seconds
          logInfraction(userName, text);
        }

        // Save cleaned message with infraction flag
        const newMessage = new Message({
          cityId: room,
          senderName: userName,
          senderAvatar: avatarUrl,
          content: cleanText,
          timestamp: new Date(),
          infraction: true,
        });

        await newMessage.save();

        io.to(room).emit("chatMessage", {
          senderName: newMessage.senderName,
          senderAvatar: newMessage.senderAvatar,
          content: newMessage.content,
          timestamp: newMessage.timestamp,
        });
      } else {
        const newMessage = new Message({
          cityId: room,
          senderName: userName,
          senderAvatar: avatarUrl,
          content: text,
          timestamp: new Date(),
          infraction: false,
        });

        await newMessage.save();

        io.to(room).emit("chatMessage", {
          senderName: newMessage.senderName,
          senderAvatar: newMessage.senderAvatar,
          content: newMessage.content,
          timestamp: newMessage.timestamp,
        });
      }
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  socket.on("typing", (data) => {
    socket.to(data.roomId).emit("typing", data.username);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
    muteMap.delete(socket.id);
    delete userInfractions[socket.id];
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});