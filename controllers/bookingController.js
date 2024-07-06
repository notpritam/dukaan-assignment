import { Op } from "sequelize";
import Booking from "../models/Booking.js";
import HotelRoom from "../models/HotelRoom.js";

const createBooking = async (roomId, userId, checkInDate, checkOutDate) => {
  console.log("createBooking", roomId, userId, checkInDate, checkOutDate);
  try {
    const isRoomAvailable = await Booking.findOne({
      where: {
        roomId: roomId,
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
    });

    if (isRoomAvailable) {
      return "Room is not available for the specified date";
      // throw new Error("Room is not available for the specified date");
    }

    const booking = await Booking.create({
      roomId,
      userId,
      checkInDate,
      checkOutDate,
    });
    return booking;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
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
    throw error;
  }
};

const getBookingDetails = async (bookingId) => {
  try {
    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    return booking;
  } catch (error) {
    console.error("Error getting booking details:", error);
    throw error;
  }
};

export { createBooking, getAvailableRooms, getBookingDetails };
