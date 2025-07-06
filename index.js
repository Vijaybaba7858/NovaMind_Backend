const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const { OpenAI } = require("openai");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/ask", async (req, res) => {
  const userMessage = req.body.question;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    res.json({ reply: chatCompletion.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI Error:", error.message);
    res.status(500).json({ error: "Something went wrong!" });
  }
});

app.get("/", (req, res) => {
  res.send("NovaMind Backend is live ✅");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
