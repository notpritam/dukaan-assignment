import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "sk-proj-B8qsABsRydCMcuuppMgdT3BlbkFJg6ifxFHeFavQMeKNpGda",
});

const functions = [
  {
    name: "booking",
    description:
      "book reserves a room for a customer and returns the booking ID",
    parameters: {
      type: "object",
      properties: {
        customerName: { type: "string" },
        roomId: { type: "string" },
        checkInDate: { type: "string" },
        checkOutDate: { type: "string" },
      },
      required: ["customerName", "roomId", "checkInDate", "checkOutDate"],
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

// import { openai, functions } from "../config/openai";

// const interactWithChatbot = async (req, res) => {
//   const { messages } = req.body;

//   // mesages will have a role and content

//   try {
//     const completion = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages,
//       functions: functions,
//     });

//     const chatbotResponse = response.choices[0].message.content;
//     res.json({ response: chatbotResponse });
//   } catch (error) {
//     console.error("Error interacting with chatbot:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }

//   while (true) {
//     const completion = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages,
//       functions: functions,
//     });

//     const message = completion.choices[0].message;
//     messages.push(message);
//     console.log(message);

//     // If there is no function call, we're done and can exit this loop
//     if (!message.function_call) {
//       console.log("no function call");
//       return;
//     }

//     // If there is a function call, we generate a new message with the role 'function'.
//     const result = await callFunction(message.function_call);
//     const newMessage = {
//       role: "function",
//       name: message.function_call.name,
//       content: JSON.stringify(result),
//     };
//     messages.push(newMessage);

//     console.log(newMessage);
//     console.log();
//   }
// };

// export { interactWithChatbot };
