const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { OpenAI } = require("openai");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // ✅ RECOMMENDED

// Health check for browser/homepage
app.get("/", (req, res) => {
  res.send("NovaMind Backend is live ✅");
});

// ✅ New Ping Route (Free — used to keep server awake)
app.get("/ping", (req, res) => {
  res.status(200).send("🔁 NovaMind Ping OK");
});

// 🧠 AI endpoint
app.post("/ask", async (req, res) => {
  const userMessage = req.body.message;
  console.log("🔹 Message received:", userMessage);

  if (!userMessage) {
    console.error("❗ Missing 'message' field in request body");
    return res.status(400).json({ error: "Missing 'message' field" });
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: userMessage }],
    });

    res.json({ reply: chatCompletion.choices[0].message.content });
  } catch (error) {
    console.error("🔴 OpenAI Error:", error);
    res.status(500).json({ error: "Something went wrong!" });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
