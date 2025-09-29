const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();
const fetch = require("node-fetch"); // ✅ Phishing checker ke liye

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

// ✅ Socket.IO Events
io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// ✅ API for sending message
app.post("/send", (req, res) => {
  const data = req.body; // pura JSON le lo
  io.emit("notification", JSON.stringify(data)); // string bana ke bhejo
  res.json({ ok: true });
});

// ✅ Phishing Link Checker API
// ✅ Web Risk API based phishing + malware URL checker
app.post("/check-url", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "❌ URL is required" });
  }

  try {
    const apiUrl = `https://webrisk.googleapis.com/v1/uris:search?key=${process.env.WEB_RISK_KEY}&uri=${encodeURIComponent(
      url
    )}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    // ✅ Agar threatTypes return hue
    if (data.threat && data.threat.threatTypes && data.threat.threatTypes.length > 0) {
      res.json({
        safe: false,
        message: `⚠️ Unsafe! Threats found: ${data.threat.threatTypes.join(", ")}`,
        details: data.threat,
      });
    } else {
      res.json({
        safe: true,
        message: "✅ Safe! No threats found.",
      });
    }
  } catch (err) {
    console.error("❌ Error checking URL:", err);
    res.status(500).json({ error: "API request failed" });
  }
});


// ✅ Health check endpoints
app.get("/", (req, res) => {
  res.send("🚀 Backend is running fine!");
});

app.get("/ping", (req, res) => {
  res.status(200).json({ ok: true, msg: "pong 🟢 Backend is awake!" });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Backend running on ${PORT}`));
