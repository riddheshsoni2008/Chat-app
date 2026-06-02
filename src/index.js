const express = require("express");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");

const app = express();

const server = http.createServer(app);

const io = socketIo(server);

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.static(path.join(__dirname, "../js")));


io.on("connection", (socket) => {
  console.log("A user connected");

  socket.emit("message", {
    username: "System",
    text: "Welcome to the chat app"
  });

  socket.broadcast.emit("message", {
    username: "System",
    text: "A user has joined the chat"
  });

  socket.on("message", (message, callback) => {
    io.emit("message", message);

    callback();
  });
  socket.on("sendLocation", (location, callback) => {
    io.emit("locationMessage", `https://www.google.com/maps?q=${location.latitude},${location.longitude}`);

    callback();
  });

  socket.on("disconnect", () => {
    io.emit("message", {
      username: "System",
      text: "A user has left the chat"
    });
  });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
