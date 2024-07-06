const getPreviousChats = () => {
  return fetch("http://localhost:3001/chat")
    .then((response) => response.json())
    .then((data) => data);
};
