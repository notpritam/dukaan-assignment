const getPreviousChats = async (token: string) => {
  return fetch("http://localhost:3001/chat", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  })
    .then((response) => response.json())
    .then((data) => data);
};

const getAllMessages = async ({
  token,
  roomId,
}: {
  token: string;
  roomId: string;
}) => {
  const response = await fetch(`http://localhost:3001/chat/${roomId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });
  const data = await response.json();
  return data;
};

const handleNewMessage = async ({
  token,
  roomId,
  message,
}: {
  token: string;
  roomId: string;
  message: string;
}) => {
  return fetch("http://localhost:3001/chat/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ chatRoomId: roomId, message }),
  })
    .then((response) => response.json())
    .then((data) => data);
};

const createRoomAndAddMessage = async ({
  token,
  message,
}: {
  token: string;
  message: string;
}) => {
  return fetch("http://localhost:3001/chat/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ message }),
  })
    .then((response) => response.json())
    .then((data) => data);
};

export {
  getPreviousChats,
  getAllMessages,
  handleNewMessage,
  createRoomAndAddMessage,
};
