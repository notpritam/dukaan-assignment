import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "/db/hotelService.sqlite",
});

export default sequelize;
