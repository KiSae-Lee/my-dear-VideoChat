const msgList = document.querySelector("ul");
const msgForm = document.querySelector("form");

const socket = new WebSocket(`ws://${window.location.host}`);
socket.addEventListener("open", () => {
  console.log("Connected to server.");
});

socket.addEventListener("message", (event) => {
  console.log(event.data);
});

socket.addEventListener("close", () => {
  console.log("Disconnected from server.");
});

setTimeout(() => socket.send("Hi"), 5000);

msgForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = msgForm.querySelector("input");
  socket.send(input.value);
});
