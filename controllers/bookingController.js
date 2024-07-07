import { Op } from "sequelize";
import Booking from "../models/Booking.js";
import HotelRoom from "../models/HotelRoom.js";

import { Resend } from "resend";

const createBooking = async (roomId, userId, checkInDate, checkOutDate) => {
  console.log("createBooking", roomId, userId, checkInDate, checkOutDate);
  try {
    console.log(
      "Booking is available",
      roomId,
      userId,
      checkInDate,
      checkOutDate
    );

    const booking = await Booking.create({
      roomId,
      userId,
      checkInDate,
      checkOutDate,
    });
    return booking;
  } catch (error) {
    return "Error Creating Booking" + error;
  }
};

const getAvailableRooms = async (checkInDate, checkOutDate) => {
  try {
    // Find all rooms that have overlapping bookings
    const overlappingBookings = await Booking.findAll({
      where: {
        [Op.or]: [
          {
            checkInDate: {
              [Op.between]: [checkInDate, checkOutDate],
            },
          },
          {
            checkOutDate: {
              [Op.between]: [checkInDate, checkOutDate],
            },
          },
          {
            [Op.and]: [
              {
                checkInDate: {
                  [Op.lte]: checkInDate,
                },
              },
              {
                checkOutDate: {
                  [Op.gte]: checkOutDate,
                },
              },
            ],
          },
        ],
      },
      attributes: ["roomId"],
      limit: 10,
    });

    // Extract room IDs from overlapping bookings
    const bookedRoomIds = overlappingBookings.map((booking) => booking.roomId);

    // Find all rooms that are not in the list of bookedRoomIds
    const availableRooms = await HotelRoom.findAll({
      where: {
        id: {
          [Op.notIn]: bookedRoomIds,
        },
      },
      limit: 10,
    });

    return availableRooms;
  } catch (error) {
    console.error("Error getting available rooms:", error);
    return error;
  }
};

const getBookingDetails = async ({ bookingId, userId }) => {
  try {
    const booking = await Booking.findOne({
      where: {
        id: bookingId,
      },
    });

    console.log("Booking Details", booking, bookingId);
    if (!booking) {
      return "Booking not found";
      // throw new Error("Booking not found");
    }

    if (booking.userId !== userId) {
      return "Unathorized";
      // throw new Error("Unauthorized");
    }

    return booking;
  } catch (error) {
    console.error("Error getting booking details:", error);
    return error;
  }
};

const getBookingByUserId = async (userId) => {
  try {
    const bookings = await Booking.findAll({
      attributes: ["id", "checkInDate", "checkOutDate"],
      where: {
        userId,
      },
      order: [["createdAt", "DESC"]],
      limit: 5,
    });

    return bookings;
  } catch (error) {
    console.error("Error getting booking by userId:", error);
    return error;
  }
};

const cancelBooking = async ({ bookingId, userId }) => {
  console.log("cancelBooking", bookingId, userId);
  try {
    const booking = await Booking.findOne({
      where: {
        id: bookingId,
      },
    });

    if (!booking) {
      return "Booking not found";
      // throw new Error("Booking not found");
    }

    if (booking.userId !== userId) {
      return "Unauthorized";
      // throw new Error("Unauthorized");
    }

    await booking.destroy();

    return "Booking cancelled";
  } catch (error) {
    return error;
  }
};

const resend = new Resend("re_123456789");

const sendBookingConfirmation = async ({ userId }) => {
  const booking = await Booking.findOne({
    where: {
      userId,
    },
    order: [["createdAt", "DESC"]],
  });
  console.log("booking", booking);
  await resend.emails.send({
    from: " <onboarding@resend.dev>",
    to: ["notpritamsharma@gmail.com"],
    subject: "Booking Confirmation",
    html: "<h1>it works!</h1>",
    headers: {
      "X-Entity-Ref-ID": "123456789",
    },
    tags: [
      {
        name: "category",
        value: "confirm_email",
      },
    ],
  });

  return booking;
};

export {
  createBooking,
  getAvailableRooms,
  getBookingDetails,
  getBookingByUserId,
  cancelBooking,
  sendBookingConfirmation,
};
