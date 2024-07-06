import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";
import User from "../User.js";

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

User.hasMany(Message, { foreignKey: "userId" });
Message.belongsTo(User, { foreignKey: "userId" });

export default Message;
