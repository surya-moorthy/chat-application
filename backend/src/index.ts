import { createServer } from "http";
import express from "express";
import { Server } from "socket.io";
import cors from "cors";

// Express app for middleware support
const app = express();

// CORS middleware
app.use(cors());

// JSON middleware (for REST routes if needed)
app.use(express.json());

// HTTP server using Express
const httpServer = createServer(app);

// Socket.IO server with CORS options
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Set specific origin in production
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("A new user has been connected:", socket.id);

  // Example socket event
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Health check route (optional)
app.get("/", (req, res) => {
  res.send({ message: "Socket.IO server is running!" });
});

const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
