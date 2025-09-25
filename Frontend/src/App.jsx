import { useEffect, useState } from "react";
import { io } from "socket.io-client";

// ⚡ Apna deployed backend ka URL daalo
const socket = io("https://message-backend-dn9x.onrender.com");

function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("notification", (msg) => {
      setMessages((prev) => [...prev, msg]);

      new window.Notification("📢 New Message", {
        body: msg,
        icon: "https://img.icons8.com/?size=512&id=85785&format=png"
      });
    });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>📢 Notifications</h1>
      <ul>
        {messages.map((m, i) => (
          <li key={i}>{m}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
