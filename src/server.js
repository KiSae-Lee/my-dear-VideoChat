// import Websocket from "ws"; // no longer use.
import http from "http"; // nodejs pre-installed lib.
import express from "express";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";

const app = express();

app.set("view engine", "pug"); // view engine set to pug.
app.set("views", __dirname + "/view"); // tell where is view files.

app.use("/public", express.static(__dirname + "/public")); // where users can access.

app.get("/", (_, res) => res.render("home")); // pug file for render.
app.get("/*", (_, res) => res.redirect("/")); // if user want to be another url. send them back to home.

// Using http protocol for debug.
const handleListen = () => console.log("Listening to https://localhost:3000");
// app.listen(3000, handleListen); // only http server.

const httpServer = http.createServer(app); // create http server.
const wsServer = new Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true,
  },
}); // create socket IO.
instrument(wsServer, {
  auth: false,
});

/* Websocket Stuff.
const wss = new Websocket.Server({ server }); // create websocket server.
// now, you can handle both of servers through https://localhost:3000.
// fake DB.
const sockets = [];

wss.on("connection", (socket) => {
  // add new user to the DB.
  sockets.push(socket);
  socket["nickname"] = "Anonymous";

  // connection msgs.
  console.log("Connected to the browser.");
  socket.on("close", () => {
    console.log("Disconnected from the browser.");
  });

  // chatting system.
  socket.on("message", (message) => {
    const parsedMsg = JSON.parse(message.toString());

    switch (parsedMsg.type) {
      case "message":
        sockets.forEach((aSocket) =>
          aSocket.send(`${socket.nickname}: ${parsedMsg.payload}`)
        );
      case "nickname":
        socket["nickname"] = parsedMsg.payload;
    }
  });
});
*/

// functions for socketIO.
function getPublicRooms() {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = wsServer;

  // or you can do this.
  // const sids = wsServer.sockets.adapter.sids;
  // const room = wsServer.sockets.adapter.rooms;

  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });

  return publicRooms;
}

function getUserCount(roomName) {
  return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

// SocketIO from here.
wsServer.on("connection", (socket) => {
  socket["nickname"] = "Anonymous"; // default user nickname.

  socket.onAny((event) => {
    console.log(`Socket Event:${event}`);
  });

  socket.on("enter_room", (roomName, func) => {
    console.log(socket.rooms);
    socket.join(roomName);
    console.log(socket.rooms);
    func();
    socket
      .to(roomName)
      .emit(
        "welcome",
        `[SYSTEM] ${socket.nickname} entered!`,
        getUserCount(roomName)
      );
    wsServer.sockets.emit("room_change", getPublicRooms());
  });

  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket
        .to(room)
        .emit(
          "bye",
          `[SYSTEM] ${socket.nickname} leaved!`,
          getUserCount(room) - 1
        )
    );
  });

  socket.on("disconnect", () => {
    wsServer.sockets.emit("room_change", getPublicRooms());
  });

  socket.on("new_msg", (message, roomName, func) => {
    socket.to(roomName).emit("new_msg", `${socket.nickname}: ${message}`);
    func();
  });

  socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
});

httpServer.listen(3000, handleListen);
