import express from "express";
import res from "express/lib/response";

const app = express();

app.set("view engine", "pug"); // view engine set to pug.
app.set("views", __dirname + "/view"); // tell where is view files.

app.use("/public", express.static(__dirname + "/public")); // where users can access.

app.get("/", (_, res) => res.render("home")); // pug file for render.
app.get("/*", (_, res) => res.redirect("/")); // if user want to be another url. send them back to home.

const handleListen = () => console.log("Listening to https://localhost:3000");
app.listen(3000, handleListen);
