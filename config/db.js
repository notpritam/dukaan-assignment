import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./db/hotelService.sqlite",
});
sequelize
  .sync()
  .then(() => {
    console.log("SQLite database synced successfully.");
  })
  .catch((err) => {
    console.error("Error syncing SQLite database:", err);
  });

export default sequelize;
