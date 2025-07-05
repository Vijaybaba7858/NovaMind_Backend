const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");

require("dotenv").config();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// ✅ THIS ROUTE MUST EXIST
app.post("/ask", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: [{ role: "user", content: userMessage }],
    });

    res.json({ reply: completion.data.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI Error:", error.message);
    res.status(500).json({ error: "Something went wrong!" });
  }
});

// Optional: Serve frontend from public/index.html
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
