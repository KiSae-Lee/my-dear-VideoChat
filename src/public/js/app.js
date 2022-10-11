const msgList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const msgForm = document.querySelector("#msg");

// DO NOT SEND JAVASCRIPT OBJ to back-end. js is not a only language.
function makeMessage(type, payload) {
  return JSON.stringify({ type, payload });
}

const socket = new WebSocket(`ws://${window.location.host}`);
socket.addEventListener("open", () => {
  console.log("Connected to server.");
});

socket.addEventListener("message", (event) => {
  const li = document.createElement("li");
  li.innerText = event.data;
  msgList.append(li);
});

socket.addEventListener("close", () => {
  console.log("Disconnected from server.");
});

msgForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = msgForm.querySelector("input");
  socket.send(makeMessage("message", input.value));
  const li = document.createElement("li");
  li.innerText = `You: ${input.value}`;
  msgList.append(li);
  input.value = "";
});

nickForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = nickForm.querySelector("input");
  socket.send(makeMessage("nickname", input.value));
});
