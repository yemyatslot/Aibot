// pages/index.js
import { useState } from 'react';
import dynamic from 'next/dynamic';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';
import ImageUploader from '../components/ImageUploader';

function RenderMath({ text }) {
  if (!text) return null;
  // split by $$...$$ then by $...$
  const parts = text.split(/(\$\$[\s\S]*?\$\$)/g);
  return parts.map((p, i) => {
    if (p.startsWith('$$') && p.endsWith('$$')) {
      return <BlockMath math={p.slice(2, -2)} key={i} />;
    }
    const inline = p.split(/(\$.*?\$)/g);
    return inline.map((ip, j) => {
      if (ip.startsWith('$') && ip.endsWith('$')) {
        return <InlineMath math={ip.slice(1, -1)} key={j} />;
      }
      return <span key={j}>{ip}</span>;
    });
  });
}

export default function Home() {
  const [language, setLanguage] = useState('en');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ocrText, setOcrText] = useState('');

  function onOcrResult({ text }) {
    setOcrText(text || '');
  }

  async function send() {
    if (!input.trim() && !ocrText.trim()) return;
    const userContent = `USER_INPUT:\n${input.trim()}\n\nOCR_TEXT:\n${ocrText.trim()}`;
    const userMsg = { role: 'user', content: userContent };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setOcrText('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next, language })
      });
      const data = await res.json();
      const reply = data.reply || data.error || 'No response';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Server error' }]);
    }

    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>AI Math Tutor (Myanmar + English)</h1>

      <div style={{ marginBottom: 12 }}>
        <label>
          Language:{' '}
          <select value={language} onChange={e => setLanguage(e.target.value)}>
            <option value="en">English</option>
            <option value="my">Myanmar</option>
          </select>
        </label>
      </div>

      <ImageUploader onResult={onOcrResult} />

      {ocrText && (
        <div style={{ marginTop: 12, padding: 8, border: '1px solid #eee' }}>
          <strong>OCR Text (editable):</strong>
          <textarea
            rows={4}
            value={ocrText}
            onChange={e => setOcrText(e.target.value)}
            style={{ width: '100%', marginTop: 8 }}
          />
        </div>
      )}

      <div style={{ marginTop: 12 }}>
        <textarea
          rows={4}
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{ width: '100%' }}
          placeholder={language === 'my' ? 'မေးချင်တာကိုရေးပါ...' : 'Type your question or leave blank to use OCR result'}
        />
        <button onClick={send} disabled={loading} style={{ marginTop: 8 }}>
          {loading ? 'Thinking...' : (language === 'my' ? 'မေးမယ်' : 'Ask')}
        </button>
      </div>

      <div style={{ marginTop: 18, borderTop: '1px solid #ddd', paddingTop: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <strong>{m.role === 'user' ? 'You' : 'Tutor'}:</strong>
            <div style={{ marginTop: 6 }}>{typeof m.content === 'string' ? <RenderMath text={m.content} /> : JSON.stringify(m.content)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
