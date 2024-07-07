import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";
import User from "../User.js";

const ChatRoom = sequelize.define(
  "ChatRoom",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false, // Ensures only one user is linked to the chat room
      references: {
        model: "Users",
        key: "id",
      },
    },
  },
  {
    tableName: "ChatRooms",
  }
);

User.hasMany(ChatRoom, { foreignKey: "userId" });
ChatRoom.belongsTo(User, { foreignKey: "userId" });

export default ChatRoom;
