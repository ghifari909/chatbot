import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    { role: "bot", content: "Hai! Saya PARIBOTZ, siap bantu 24/7 ✨" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newMessages })
      });

      const data = await res.json();
      setLoading(false);

      if (data && data.response) {
        setMessages([...newMessages, { role: "bot", content: data.response }]);
      } else {
        setMessages([...newMessages, { role: "bot", content: "⚠️ Maaf, ada gangguan nih. Coba lagi ya?" }]);
      }
    } catch (err) {
      setLoading(false);
      setMessages([...newMessages, { role: "bot", content: "🚨 Error jaringan, coba lagi!" }]);
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="logo">🤖</div>
        <h1>PARIBOTZ</h1>
        <div className="status">Online</div>
      </div>

      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.role === "user" ? "user-message" : "bot-message"}`}>
            {m.content}
          </div>
        ))}
        {loading && <div className="typing-indicator">Bot lagi ngetik...</div>}
      </div>

      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Tulis pesanmu..."
        />
        <button onClick={sendMessage}>Kirim</button>
      </div>

      <style jsx>{`
        :root {
          --bg: #0d0d0f;
          --surface: rgba(255,255,255,.04);
          --neon: #00f5ff;
          --purple: #8c52ff;
          --text: #f1f1f1;
          --text-secondary: #a1a1a1;
        }
        body, html { margin:0; padding:0; height:100%; background:var(--bg); }
        .chat-container {
          width:100%; max-width:900px; margin:auto; height:100vh;
          display:flex; flex-direction:column; color:var(--text);
          background:var(--surface); border-radius:20px; overflow:hidden;
        }
        .chat-header { display:flex; align-items:center; gap:10px; padding:20px; background:rgba(0,0,0,.3); }
        .chat-messages { flex:1; overflow-y:auto; padding:20px; display:flex; flex-direction:column; gap:10px; }
        .message { padding:12px 16px; border-radius:16px; max-width:70%; }
        .user-message { background:linear-gradient(135deg,var(--neon),var(--purple)); align-self:flex-end; }
        .bot-message { background:rgba(255,255,255,.1); align-self:flex-start; }
        .chat-input { display:flex; padding:15px; gap:10px; background:rgba(0,0,0,.3); }
        input { flex:1; padding:12px 16px; border-radius:50px; border:none; background:rgba(255,255,255,.1); color:var(--text); }
        button { padding:0 20px; border:none; border-radius:50px; background:linear-gradient(135deg,var(--neon),var(--purple)); cursor:pointer; }
      `}</style>
    </div>
  );
}
