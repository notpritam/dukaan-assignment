import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import sequelize from "./config/db.js";
import { router as chatBotRoutes } from "./routes/chatBotRoutes.js";
import { router as authRoutes } from "./routes/authRoutes.js";
import User from "./models/User.js";
import Booking from "./models/Booking.js";
import HotelRoom from "./models/HotelRoom.js";
import { faker } from "@faker-js/faker";
import _ from "lodash";

import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(bodyParser.json());

// Routes
app.use("/chat", chatBotRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the chat bot API");
});

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

// const generateAndAddRooms = async () => {
//   try {
//     await sequelize.sync(); // Ensure the database schema is synchronized

//     const roomsToGenerate = 1000;
//     const rooms = [];
//     const roomNames = [
//       "Deluxe Room",
//       "Suite Room",
//       "Premium Room",
//       "Executive Room",
//       "Standard Room",
//       "Family Room",
//       "Single Room",
//       "Double Room",
//       "Twin Room",
//       "King Room",
//     ];

//     for (let i = 1; i <= roomsToGenerate; i++) {
//       const randomRoomName =
//         roomNames[Math.floor(Math.random() * roomNames.length)];
//       rooms.push({
//         name: `${randomRoomName} ${i}`,
//         description: `Description for ${randomRoomName} ${i}`,
//         price: Math.floor(Math.random() * 500) + 50, // Random price between 50 and 550
//       });
//     }

//     await HotelRoom.bulkCreate(rooms);

//     console.log(`Added ${roomsToGenerate} rooms to the database.`);
//   } catch (error) {
//     console.error("Error generating and adding rooms:", error);
//   }
// };

// generateAndAddRooms();

// const createFakeUsersAndBookings = async () => {
//   try {
//     await sequelize.sync(); // Sync models with database

//     const usersToGenerate = 100;
//     const bookingsToGenerate = 1000;
//     const bookings = [];

//     // Create fake users
//     const users = [];
//     for (let i = 1; i <= usersToGenerate; i++) {
//       const firstName = faker.person.firstName();
//       const lastName = faker.person.lastName();
//       const username = faker.internet.userName();
//       const email = `notpritam${i}@example.com`;
//       const password = "12345678";

//       const user = await User.create({
//         firstName,
//         lastName,
//         username,
//         email,
//         password,
//       });

//       users.push(user);
//     }

//     // Create bookings for random users and rooms
//     const startDate = new Date("2022-01-01");
//     const endDate = new Date("2024-07-10");

//     for (let i = 0; i < bookingsToGenerate; i++) {
//       const randomUserId = _.random(1, usersToGenerate); // Random user ID between 1 and usersToGenerate
//       const roomId = _.random(1, 100); // Assuming there are 100 hotel rooms

//       const randomStartDate = faker.date.between({
//         from: startDate,
//         to: endDate,
//       });
//       const randomEndDate = faker.date.between({
//         from: randomStartDate,
//         to: endDate,
//       });

//       const booking = {
//         roomId,
//         userId: randomUserId,
//         checkInDate: randomStartDate,
//         checkOutDate: randomEndDate,
//       };

//       bookings.push(booking);
//     }

//     await Booking.bulkCreate(bookings);

//     console.log(
//       `Added ${usersToGenerate} users and ${bookingsToGenerate} bookings.`
//     );
//   } catch (error) {
//     console.error("Error creating users and bookings:", error);
//   }
// };

// createFakeUsersAndBookings();
