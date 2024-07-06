import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const HotelRoom = sequelize.define("HotelRoom", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

(async () => {
  await sequelize.sync({ force: true });
  // Code here
})();

export default HotelRoom;
