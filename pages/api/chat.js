// pages/api/chat.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST allowed' });
  const body = req.body;
  const messages = body.messages || [];
  const language = body.language === 'my' ? 'Myanmar' : 'English';

  // Compose system prompt that enforces precise math steps and LaTeX output
  const systemPrompt = `You are an expert third-year university mathematics tutor. Answer the student's question step-by-step. Use LaTeX for mathematical expressions and wrap display equations in $$ $$ and inline math in $ $. Show intermediate steps and final concise answer. If the user provided OCR text, prefer that as the problem statement. Answer in ${language}.`;

  // Build chat payload
  const chatMessages = [
    { role: 'system', content: systemPrompt },
    ...messages
  ];

  try {
    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) return res.status(500).json({ error: 'OPENAI_API_KEY not configured' });

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: chatMessages,
        temperature: 0.0,
        max_tokens: 1500
      })
    });

    const data = await r.json();
    const reply = data?.choices?.[0]?.message?.content || data?.error?.message || 'No reply';
    return res.status(200).json({ reply });
  } catch (err) {
    console.error('API error', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
