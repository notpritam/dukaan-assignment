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
