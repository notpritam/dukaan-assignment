import express from "express";
import bodyParser from "body-parser";
import sequelize from "./config/db.js";
import { router as chatBotRoutes } from "./routes/chatBotRoutes.js";
import { router as authRoutes } from "./routes/authRoutes.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

// Routes
app.use("/chat", chatBotRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the chat bot API");
});

// Start server
sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });
