// pages/index.js
import { useState } from "react";
import Tesseract from "tesseract.js";
import 'katex/dist/katex.min.css';
import { BlockMath } from "react-katex";

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState("");
  const [ocrText, setOcrText] = useState("");

  const handleSend = async () => {
    if (!input && !ocrText) return;

    setLoading(true);
    const message = input || ocrText;

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    setReply(data.reply || "Error");
    setLoading(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Tesseract.recognize(file, "eng+my", {
      logger: (m) => console.log(m),
    }).then(({ data: { text } }) => {
      setOcrText(text);
    });
  };

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">📘 AI Math Bot (Myanmar + English)</h1>

      <textarea
        className="border p-2 w-full"
        placeholder="Enter your math question..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <div className="my-4">
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {ocrText && <p className="text-sm mt-2">OCR Result: {ocrText}</p>}
      </div>

      <button
        onClick={handleSend}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Thinking..." : "Ask AI"}
      </button>

      {reply && (
        <div className="mt-6 p-4 border rounded bg-gray-50 text-left">
          <h2 className="font-semibold">AI Answer:</h2>
          <p>{reply}</p>
          {/* Render LaTeX if present */}
          <BlockMath math={reply} />
        </div>
      )}
    </div>
  );
}
