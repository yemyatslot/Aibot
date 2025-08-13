import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const addMessage = (sender, text) => {
    setMessages((prev) => [...prev, { sender, text }]);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    addMessage("user", input);
    const userMessage = input;
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();
      addMessage("ai", data.reply || "(No reply)");
    } catch (err) {
      console.error(err);
      addMessage("ai", "(Error connecting to AI)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: 20 }}>
      <h1>Talk to My AI</h1>

      <div
        style={{
          border: "1px solid #ccc",
          padding: 10,
          height: 300,
          overflowY: "auto",
          marginBottom: 10,
        }}
      >
        {messages.map((msg, index) => (
          <p key={index}>
            <strong style={{ color: msg.sender === "user" ? "blue" : "green" }}>
              {msg.sender}:
            </strong>{" "}
            {msg.text}
          </p>
        ))}
        {loading && <p style={{ color: "gray" }}>AI is typing...</p>}
      </div>

      <div style={{ display: "flex", gap: "5px" }}>
        <input
          type="text"
          placeholder="Type something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={sendMessage} style={{ padding: "8px 15px" }}>
          Send
        </button>
      </div>
    </div>
  );
}
