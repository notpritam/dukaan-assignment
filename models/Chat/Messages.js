import { DataTypes } from "sequelize";
import sequelize from "../config/db";
import User from "../User";

const Message = sequelize.define("Message", {
  // Model attributes are defined here
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  roomId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    // You can add references to ChatRoom model if needed
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: "id",
    },
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  isBot: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false, // Default to false for user messages
  },
});

(async () => {
  await sequelize.sync({ force: true });
  // Code here
})();

export default Message;
