const express = require("express");
const axios = require("axios");

import { openai, functions } from "./config/openai";

// gets API Key from environment variable OPENAI_API_KEY
const openai = new OpenAI({
  apiKey: "sk-proj-B8qsABsRydCMcuuppMgdT3BlbkFJg6ifxFHeFavQMeKNpGda",
});

async function callFunction(function_call) {
  const args = JSON.parse(function_call.arguments);
  switch (function_call.name) {
    case "book":
      return await book(
        args["customerName"],
        args["roomType"],
        args["checkInDate"],
        args["checkOutDate"]
      );

    case "getBooking":
      return await getBooking(args["bookingId"]);

    case "getAvailableRooms":
      return await getAvailableRooms(args["checkInDate"], args["checkOutDate"]);

    default:
      throw new Error("No function found");
  }
}

const app = express();
const port = 3000;

app.use(express.json());

app.get("/messages", async (req, res) => {
  try {
    const response = await axios.get("https://api.example.com/messages");
    const messages = response.data;
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

app.post("/messages", async (req, res) => {
  try {
    const { role, content } = req.body;
    const response = await axios.post("https://api.example.com/messages", {
      role,
      content,
    });
    const message = response.data;
    res.json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

async function main() {
  const messagesResponse = await axios.get("https://api.example.com/messages");
  const messages = messagesResponse.data;
  console.log(messages);

  while (true) {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      functions: functions,
    });

    const message = completion.choices[0].message;
    messages.push(message);
    console.log(message);

    // If there is no function call, we're done and can exit this loop
    if (!message.function_call) {
      return;
    }

    // If there is a function call, we generate a new message with the role 'function'.
    const result = await callFunction(message.function_call);
    const newMessage = {
      role: "function",
      name: message.function_call.name,
      content: JSON.stringify(result),
    };
    messages.push(newMessage);

    console.log(newMessage);
    console.log();
  }
}

main();

const db = {
  customers: [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
    },
  ],
  rooms: [
    {
      id: 101,
      type: "single",
      price: 100,
      status: "available",
    },
    {
      id: 102,
      type: "double",
      price: 150,
      status: "available",
    },
    {
      id: 201,
      type: "suite",
      price: 250,
      status: "booked",
    },
  ],
  bookings: [
    {
      id: "booking123",
      customerId: 1,
      roomId: 201,
      checkInDate: "2023-05-01",
      checkOutDate: "2023-05-05",
    },
  ],
};

const book = async (customerName, roomType, checkInDate, checkOutDate) => {
  const customer = db.customers.find((c) => c.name === customerName);
  if (!customer) {
    throw new Error("Customer not found");
  }

  const room = db.rooms.find(
    (r) => r.type === roomType && r.status === "available"
  );
  if (!room) {
    throw new Error("Room not available");
  }

  const booking = {
    id: `booking${Math.floor(Math.random() * 1000)}`,
    customerId: customer.id,
    roomId: room.id,
    checkInDate,
    checkOutDate,
  };

  db.bookings.push(booking);
  room.status = "booked";

  return booking.id;
};

const getBooking = async (bookingId) => {
  const booking = db.bookings.find((b) => b.id === bookingId);
  if (!booking) {
    throw new Error("Booking not found");
  }

  const customer = db.customers.find((c) => c.id === booking.customerId);
  const room = db.rooms.find((r) => r.id === booking.roomId);

  return {
    id: booking.id,
    customer: customer.name,
    room: room.type,
    checkInDate: booking.checkInDate,
    checkOutDate: booking.checkOutDate,
  };
};

const getAvailableRooms = async (checkInDate, checkOutDate) => {
  const availableRooms = db.rooms.filter((r) => r.status === "available");

  return availableRooms.map((room) => ({
    id: room.id,
    type: room.type,
    price: room.price,
  }));
};

main();
