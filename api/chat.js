// api/chat.js

// Debug: check if Vercel sees the OpenAI key
console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY ? "FOUND" : "MISSING");

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

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
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
      temperature: 0.7
    });

    const reply = response.choices[0].message.content;
    return res.status(200).json({ reply });
  } catch (err) {
    console.error("OpenAI request failed:", err.message);
    return res.status(500).json({ reply: "AI request failed! Please try again." });
  }
}
