app.post("/ask", async (req, res) => {
  console.log("➡️ [DEBUG] POST /ask called");
  console.log("Body received:", req.body);

  const userMessage = req.body.message;
  console.log("Extracted message:", userMessage);

  if (!userMessage) {
    console.error("⚠️ No message provided");
    return res.status(400).json({ error: "Missing 'message' in request body" });
  }

  try {
    console.log("⏳ Calling OpenAI API with model:", "gpt-4o");
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: userMessage }],
    });
    console.log("✅ OpenAI response received");
    res.json({ reply: chatCompletion.choices[0].message.content });
  } catch (error) {
    console.error("🔴 OpenAI Error:", error);
    res.status(500).json({ error: `OpenAI call failed: ${error.message}` });
  }
});
