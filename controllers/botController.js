import { openai, functions } from "../config/openai.js";
import {
  cancelBooking,
  createBooking,
  getAvailableRooms,
  getBookingByUserId,
  getBookingDetails,
} from "./bookingController.js";

const interactWithChatbot = async ({ messages, userId }) => {
  while (true) {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      functions: functions,
    });

    const message = completion.choices[0].message;
    messages.push(message);
    console.log(message);

    if (!message.function_call) {
      return messages[messages.length - 1];
    }

    const result = await callFunction({
      function_call: message.function_call,
      userId,
    });
    const newMessage = {
      role: "function",
      name: message.function_call.name,
      content: JSON.stringify(result),
    };

    messages.push(newMessage);

    console.log(newMessage);
    console.log();
  }
};

async function callFunction({ function_call, userId }) {
  const args = JSON.parse(function_call.arguments);
  switch (function_call.name) {
    case "booking":
      return await createBooking(
        args["roomId"],
        userId,
        args["checkInDate"],
        args["checkOutDate"]
      );

    case "getBooking":
      return await getBookingDetails({
        bookingId: args["bookingId"],
        userId,
      });
    //   return "getBooking";

    case "getAvailableRooms":
      return await getAvailableRooms(args["checkInDate"], args["checkOutDate"]);

    case "getBookingByUserId":
      return await getBookingByUserId(userId);
    //   return "getAvailableRooms";

    case "cancelBooking":
      return cancelBooking({
        bookingId: args["bookingId"],
        userId,
      });

    default:
      throw new Error("No function found");
  }
}

export { interactWithChatbot };
