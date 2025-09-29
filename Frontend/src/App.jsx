import React, { useState } from "react";
import "./App.css";

function App() {
  // ✅ State for phishing checker
  const [url, setUrl] = useState("");
  const [result, setResult] = useState("");

  // ✅ Function to check URL
  const checkUrl = async () => {
    try {
const res = await fetch("https://message-backend-dn9x.onrender.com/check-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      setResult(data.message);
    } catch (err) {
      setResult("❌ Error checking URL");
    }
  };

  return (
    <div className="awareness-app">
      {/* Header */}
      <header className="header">
        <h1>🛡️ Defend Me Pro</h1>
        <p>Stay Safe from Cyber Frauds & Scams</p>
      </header>

      {/* Main Awareness Content */}
      <main className="content">
        <section className="card">
          <h2>🚨 Phishing Emails</h2>
          <p>
            Fraudsters send fake emails that look like they’re from trusted companies.
            They trick you into clicking links or giving away passwords.
            <strong> Never share OTP or bank details over email.</strong>
          </p>
        </section>

        <section className="card">
          <h2>💳 Fake Job & Lottery Scams</h2>
          <p>
            If someone offers you a high-paying job or says you won a lottery but asks
            for money first – it’s a scam. <strong>Never pay upfront fees.</strong>
          </p>
        </section>

        <section className="card">
          <h2>📞 Phone & WhatsApp Fraud</h2>
          <p>
            Scammers pretend to be bank officials or relatives. They ask for OTP, UPI PIN,
            or money transfer. <strong>Disconnect the call & verify from official sources.</strong>
          </p>
        </section>

        <section className="card">
          <h2>🌐 Safe Practices</h2>
          <ul>
            <li>✔️ Enable 2-Factor Authentication</li>
            <li>✔️ Use strong, unique passwords</li>
            <li>✔️ Don’t click unknown links</li>
            <li>✔️ Report fraud to Cyber Crime Portal</li>
          </ul>
        </section>

        {/* ✅ New Feature: Phishing Link Checker */}
        <section className="card">
          <h2>🔍 Phishing Link Checker</h2>
          <input
            type="text"
            placeholder="Paste suspicious link here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{ width: "70%", padding: "8px", marginRight: "10px" }}
          />
          <button onClick={checkUrl} style={{ padding: "8px 12px" }}>
            Check
          </button>
          <p style={{ marginTop: "10px", fontWeight: "bold" }}>{result}</p>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        ⚡ Awareness is the best defense against cyber frauds.
      </footer>
    </div>
  );
}

export default App;
