const socket = io(); // back-front connection.

//
// Video call. based on WebRTC.
//

// Room stuff.
const callWelcome = document.querySelector("#callWelcome");
const callWelcomeForm = callWelcome.querySelector("form");
const call = document.querySelector("#call");
let videoRoomName = "";
call.hidden = true;

callWelcomeForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const input = callWelcome.querySelector("input");
  await initCall();
  socket.emit("join_video_room", input.value);
  videoRoomName = input.value;
  input.value = "";
});

// video stuff.
const myFace = document.querySelector("#myFace");
let myStream;
let myPeerConnection;

const btn_mute = document.querySelector("#mute");
const btn_camera = document.querySelector("#camera");
let mute_flag = true;
let camera_flag = true;

const sel_videoInputs = document.querySelector("#videoInputs");

btn_mute.addEventListener("click", () => {
  myStream
    .getAudioTracks()
    .forEach((track) => (track.enabled = !track.enabled));

  if (mute_flag) {
    btn_mute.innerText = "Sound";
    mute_flag = false;
  } else {
    btn_mute.innerText = "Mute";
    mute_flag = true;
  }
});

btn_camera.addEventListener("click", () => {
  myStream
    .getVideoTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if (camera_flag) {
    btn_camera.innerText = "Camera Turn Off";
    camera_flag = false;
  } else {
    btn_camera.innerText = "Camera Turn On";
    camera_flag = true;
  }
});

sel_videoInputs.addEventListener("input", async () => {
  await getMedia(sel_videoInputs.value);
});

async function getCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === "videoinput");
    const current_Cam = myStream.getVideoTracks()[0];
    cameras.forEach((camera) => {
      const option = document.createElement("option");
      option.value = camera.deviceId;
      option.innerText = camera.label;
      if (current_Cam.label === camera.label) {
        option.selected = true;
      }
      sel_videoInputs.appendChild(option);
    });
  } catch (e) {
    console.log(e);
  }
}

async function getMedia(Cam_deviceId) {
  const initialConstrains = {
    audio: true,
    video: { facingMode: "user" },
  };

  const cameraConstrains = {
    audio: true,
    video: { deviceId: { exact: Cam_deviceId } },
  };

  try {
    myStream = await navigator.mediaDevices.getUserMedia(
      Cam_deviceId ? cameraConstrains : initialConstrains
    );
    myFace.srcObject = myStream;
    if (!Cam_deviceId) {
      await getCameras();
    }
  } catch (e) {
    console.log(e);
  }
}

async function initCall() {
  call.hidden = false;
  callWelcome.hidden = true;
  await getMedia();
  makeConnection();
}

// RTC.

function makeConnection() {
  myPeerConnection = new RTCPeerConnection();
  myStream.getTracks().forEach((track) => {
    myPeerConnection.addTrack(track, myStream);
  });
}

// socket.

socket.on("video_room_welcome", async () => {
  const offer = await myPeerConnection.createOffer();
  myPeerConnection.setLocalDescription(offer);
  socket.emit("offer", offer, videoRoomName);
});

socket.on("offer", async (offer) => {
  myPeerConnection.setRemoteDescription(offer);
  const answer = await myPeerConnection.createAnswer();
  myPeerConnection.setLocalDescription(answer);
  socket.emit("answer", answer, roomName);
});

socket.on("answer", (answer) => {
  myPeerConnection.setRemoteDescription(answer);
});

//
// Chatting Room. based on websocket.
//

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

socket.on("welcome", (message, count) => {
  const h3 = document.querySelector("h3");
  h3.innerText = `Room ${roomName}. User Count: ${count}`;
  addMessage(message);
});

socket.on("bye", (message, count) => {
  const h3 = document.querySelector("h3");
  h3.innerText = `Room ${roomName}. User Count: ${count}`;
  addMessage(message);
});

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
