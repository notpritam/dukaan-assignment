import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "sk-proj-B8qsABsRydCMcuuppMgdT3BlbkFJg6ifxFHeFavQMeKNpGda",
});

const functions = [
  {
    name: "book",
    description:
      "book reserves a room for a customer and returns the booking ID",
    parameters: {
      type: "object",
      properties: {
        customerName: { type: "string" },
        roomType: { type: "string", enum: ["single", "double", "suite"] },
        checkInDate: { type: "string" },
        checkOutDate: { type: "string" },
      },
      required: ["customerName", "roomType", "checkInDate", "checkOutDate"],
    },
  },
  {
    name: "getBooking",
    description:
      "getBooking retrieves the booking details based on the booking ID",
    parameters: {
      type: "object",
      properties: {
        bookingId: { type: "string" },
      },
      required: ["bookingId"],
    },
  },
  {
    name: "getAvailableRooms",
    description:
      "getAvailableRooms returns a list of available rooms based on the check-in and check-out dates",
    parameters: {
      type: "object",
      properties: {
        checkInDate: { type: "string" },
        checkOutDate: { type: "string" },
      },
      required: ["checkInDate", "checkOutDate"],
    },
  },
];

export { openai, functions };
