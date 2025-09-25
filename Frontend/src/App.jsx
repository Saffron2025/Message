import { useEffect, useState } from "react";
import { io } from "socket.io-client";

// backend url
const socket = io("http://localhost:5000");

function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("notification", (msg) => {
      setMessages((prev) => [...prev, msg]);
      new window.Notification("📢 New Message", { body: msg });
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
