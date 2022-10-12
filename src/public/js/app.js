const socket = io(); // back-front connection.

// get welcome stuff.
const welcome = document.querySelector("#welcome");
const welcomeForm = welcome.querySelector("form");

const room = document.querySelector("#room");
let roomName = "";
room.hidden = true;

function enterRoom() {
  room.hidden = false;
  welcomeForm.hidden = true;
  const h3 = document.querySelector("h3");
  h3.innerText = `Room ${roomName}`;

  const form = room.querySelector("#msg");
  const name = room.querySelector("#nickname");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const input = form.querySelector("input");
    const value = input.value;

    socket.emit("new_msg", input.value, roomName, () => {
      addMessage(`You: ${value}`);
    });
    input.value = "";
  });

  name.addEventListener("submit", (event) => {
    event.preventDefault();

    const input = name.querySelector("input");
    const value = input.value;

    socket.emit("nickname", value);
  });
}

function addMessage(message) {
  console.log("addMessage function called!");
  const ul = document.querySelector("ul");
  console.log(ul);
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

welcomeForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const input = welcome.querySelector("input");

  socket.emit("enter_room", input.value, enterRoom);
  roomName = input.value;
  input.value = ""; // clear after use.
});

socket.on("welcome", addMessage);

socket.on("bye", addMessage);

socket.on("new_msg", addMessage);

socket.on("room_change", (rooms) => {
  const roomList = welcome.querySelector("ul");
  roomList.innerHTML = "";

  if (rooms.length === 0) {
    return;
  }

  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  });
});

/* with websocket.
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
*/
