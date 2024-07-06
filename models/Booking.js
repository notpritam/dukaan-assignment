import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import HotelRoom from "./HotelRoom.js";

const Booking = sequelize.define("Booking", {
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

HotelRoom.hasMany(Booking, { foreignKey: "roomId" });
Booking.belongsTo(HotelRoom, { foreignKey: "roomId" });

(async () => {
  await sequelize.sync({ force: true });
  // Code here
})();

export default Booking;
