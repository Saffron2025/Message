import { useEffect, useState } from "react";

function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // ✅ Electron se notification messages suno
    window.electronAPI?.onMessage((msg) => {
      setMessages((prev) => [...prev, msg]);
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
