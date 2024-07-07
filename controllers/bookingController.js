import { Op } from "sequelize";
import Booking from "../models/Booking.js";
import HotelRoom from "../models/HotelRoom.js";

const createBooking = async (roomId, userId, checkInDate, checkOutDate) => {
  console.log("createBooking", roomId, userId, checkInDate, checkOutDate);
  try {
    // const isRoomAvailable = await Booking.findOne({
    //   where: {
    //     roomId: roomId,
    //     [Op.or]: [
    //       {
    //         checkInDate: {
    //           [Op.between]: [checkInDate, checkOutDate],
    //         },
    //       },
    //       {
    //         checkOutDate: {
    //           [Op.between]: [checkInDate, checkOutDate],
    //         },
    //       },
    //       {
    //         [Op.and]: [
    //           {
    //             checkInDate: {
    //               [Op.lte]: checkInDate,
    //             },
    //           },
    //           {
    //             checkOutDate: {
    //               [Op.gte]: checkOutDate,
    //             },
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // });

    // if (isRoomAvailable) {
    //   return "Room is not available for the specified date";
    //   // throw new Error("Room is not available for the specified date");
    // }

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

export {
  createBooking,
  getAvailableRooms,
  getBookingDetails,
  getBookingByUserId,
};
