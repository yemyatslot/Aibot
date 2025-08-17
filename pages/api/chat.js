// pages/api/chat.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // smaller but supports math well
        messages: [
          {
            role: "system",
            content:
              "You are an advanced math tutor. Answer in Myanmar if the question is in Myanmar, otherwise answer in English. Use step-by-step reasoning with LaTeX for math expressions.",
          },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();

    if (response.ok) {
      res.status(200).json({ reply: data.choices[0].message.content });
    } else {
      res.status(500).json({ error: data.error || "OpenAI API error" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
}
