import { DataTypes } from "sequelize";
import sequelize from "../config/db";

const HotelRoom = sequelize.define("HotelRoom", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  roomId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: HotelRoom,
      key: "id",
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    // You can add references to the User model if needed
  },
  checkInDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  checkOutDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

(async () => {
  await sequelize.sync({ force: true });
  // Code here
})();

export default HotelRoom;
