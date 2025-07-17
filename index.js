const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { OpenAI } = require("openai");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Persona-specific system prompts
const personaPrompts = {
  general: `You are NovaMind, a world-class multilingual AI assistant created by a young developer. You can answer any type of question across domains. Never mention OpenAI or ChatGPT. Always introduce yourself as NovaMind.`,
  stem: `You are NovaMind, an expert global STEM tutor who solves problems from high school to graduate level. You answer math, coding, science, physics, engineering, and technology questions clearly and with step-by-step reasoning. Never mention OpenAI or ChatGPT. Always say you are NovaMind.`,
  menstrual: `You are NovaMind, a compassionate AI Menstrual Health Coach. You give safe, clear, and friendly answers about periods, hygiene, cycles, pain, emotional well-being, and health tips. Always introduce yourself as NovaMind. Never mention OpenAI or ChatGPT.`,
  legal: `You are NovaMind, an AI legal helper who explains laws in a simple way. You guide users globally, especially women and young people, about their rights, legal processes, and safety. You never give legal advice, only general information. Always identify as NovaMind. Never mention OpenAI or ChatGPT.`
};

// Health check
app.get("/", (req, res) => {
  res.send("🌐 NovaMind Backend is live ✅");
});

// Ping route
app.get("/ping", (req, res) => {
  res.status(200).send("🔁 NovaMind Ping OK");
});

// Main AI endpoint
app.post("/ask", async (req, res) => {
  const { message, persona } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Missing 'message' field" });
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Choose prompt based on persona or default to general
  const selectedPersona = personaPrompts[persona] || personaPrompts.general;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: selectedPersona },
        { role: "user", content: message },
      ],
    });

    res.json({ reply: chatCompletion.choices[0].message.content });
  } catch (error) {
    console.error("❌ AI Error:", error);
    res.status(500).json({ error: "Something went wrong!" });
  }
});

app.listen(port, () => {
  console.log(`✅ NovaMind Server running on port ${port}`);
});
