import express from "express";
import axios from "axios";
import sequelize from "./config/db.js";

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

try {
  await sequelize.authenticate();
  app.listen(port, () => {
    console.log("Connection has been established successfully.");
  });
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}
