// import Websocket from "ws"; // no longer use.
import http from "http"; // nodejs pre-installed lib.
import express from "express";

const app = express();

app.set("view engine", "pug"); // view engine set to pug.
app.set("views", __dirname + "/view"); // tell where is view files.

app.use("/public", express.static(__dirname + "/public")); // where users can access.

app.get("/", (_, res) => res.render("home")); // pug file for render.
app.get("/*", (_, res) => res.redirect("/")); // if user want to be another url. send them back to home.

// Using http protocol for debug.
const handleListen = () => console.log("Listening to https://localhost:3000");
// app.listen(3000, handleListen); // only http server.

const server = http.createServer(app); // create http server.
const wss = new Websocket.Server({ server }); // create websocket server.

// now, you can handle both of servers through https://localhost:3000.

// anonymous function.
// (var1, var2, ...) => { "your function here." }

/* Websocket Stuff.
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

server.listen(3000, handleListen);
