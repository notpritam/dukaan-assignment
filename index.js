import { openai, functions } from "./config/openai";
const express = require("express");
const axios = require("axios");

const app = express();
const port = 3000;

app.use(express.json());

app.get("/messages", async (req, res) => {
  try {
    const response = await axios.get("https://api.example.com/messages");
    const messages = response.data;
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

app.post("/messages", async (req, res) => {
  try {
    const { role, content } = req.body;
    const response = await axios.post("https://api.example.com/messages", {
      role,
      content,
    });
    const message = response.data;
    res.json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

async function main() {
  const messagesResponse = await axios.get("https://api.example.com/messages");
  const messages = messagesResponse.data;
  console.log(messages);

  while (true) {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      functions: functions,
    });

    const message = completion.choices[0].message;
    messages.push(message);
    console.log(message);

    // If there is no function call, we're done and can exit this loop
    if (!message.function_call) {
      return;
    }

    // If there is a function call, we generate a new message with the role 'function'.
    const result = await callFunction(message.function_call);
    const newMessage = {
      role: "function",
      name: message.function_call.name,
      content: JSON.stringify(result),
    };
    messages.push(newMessage);

    console.log(newMessage);
    console.log();
  }
}

main();
