const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "*", // allow frontend URL later
    methods: ["GET", "POST"]
  }
});

// Basic route (test)
app.get("/", (req, res) => {
  res.send("Real-time Chat Backend Running 🚀");
});

// Socket connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join room
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  // Send message
  socket.on("send_message", (data) => {
    /*
      data = {
        roomId,
        sender,
        message,
        time
      }
    */
    socket.to(data.roomId).emit("receive_message", data);
  });

  // Typing indicator
  socket.on("typing", (roomId) => {
    socket.to(roomId).emit("user_typing");
  });

  // Stop typing
  socket.on("stop_typing", (roomId) => {
    socket.to(roomId).emit("stop_typing");
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Server start
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
