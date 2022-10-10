import Websocket from "ws";
import http from "http"; // nodejs pre-installed lib.
import express from "express";

const app = express();

app.set("view engine", "pug"); // view engine set to pug.
app.set("views", __dirname + "/view"); // tell where is view files.

app.use("/public", express.static(__dirname + "/public")); // where users can access.

app.get("/", (req, res) => res.render("home")); // pug file for render.
app.get("/*", (req, res) => res.redirect("/")); // if user want to be another url. send them back to home.

// Using http protocol for debug.
const handleListen = () => console.log("Listening to https://localhost:3000");
// app.listen(3000, handleListen); // only http server.

const server = http.createServer(app); // create http server.
const wss = new Websocket.Server({ server }); // create websocket server.

// now, you can handle both of servers through https://localhost:3000.

server.listen(3000, handleListen);
