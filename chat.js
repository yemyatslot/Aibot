export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = JSON.parse(req.body);

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: [{ role: "user", content: message }]
      })
    });

    const data = await response.json();
    const reply = data.output_text || data.output?.[0]?.content?.[0]?.text || "(No reply)";

    res.status(200).json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}
