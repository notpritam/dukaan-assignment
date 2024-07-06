import { DataTypes } from "sequelize";
import sequelize from "../config/db";

const ChatRoom = sequelize.define("ChatRoom", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true, // Ensures only one user is linked to the chat room
    references: {
      model: "User",
      key: "id",
    },
  },
});

(async () => {
  await sequelize.sync({ force: true });
  // Code here
})();

export default ChatRoom;
