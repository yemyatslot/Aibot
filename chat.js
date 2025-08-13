export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // ✅ In Next.js, req.body is already parsed if Content-Type is JSON
    const { message } = req.body;

    // If no message, return error
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Invalid message" });
    }

    // Call OpenAI
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: [
          {
            role: "system",
            content: [{ type: "text", text: "You are a friendly assistant. Always greet politely and offer help." }],
          },
          {
            role: "user",
            content: [{ type: "text", text: message }],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI API error:", errText);
      return res.status(500).json({ error: "Failed to connect to AI" });
    }

    const data = await response.json();

    // ✅ Correct path for GPT-4o-mini output
    const reply = data.output?.[0]?.content?.[0]?.text || "(No reply)";

    res.status(200).json({ reply });

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error" });
  }
}
