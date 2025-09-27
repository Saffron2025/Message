const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// API for sending message
// API for sending message
app.post("/send", (req, res) => {
  const data = req.body; // pura JSON le lo
  io.emit("notification", JSON.stringify(data)); // string bana ke bhejo
  res.json({ ok: true });
});


app.get("/", (req, res) => {
  res.send("🚀 Backend is running fine!");
});

// ✅ Health check endpoint
app.get("/ping", (req, res) => {
  res.status(200).json({ ok: true, msg: "pong 🟢 Backend is awake!" });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Backend running on ${PORT}`));
