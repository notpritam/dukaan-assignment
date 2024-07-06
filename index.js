import express from "express";
import bodyParser from "body-parser";
import sequelize from "./config/db";
import { router as chatBotRoutes } from "./routes/chatBotRoutes";
import { router as authRoutes } from "./routes/authRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Routes
app.use("/chat", chatBotRoutes);
app.use("/auth", authRoutes);

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
