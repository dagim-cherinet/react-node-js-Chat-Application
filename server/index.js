const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const { addUser, getUser, removeUser, getUsersInRoom } = require("./users");

const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
io.on("connection", (socket) => {
  // console.log("we have new connection");

  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });
    if (error) return callback(error);

    socket.emit("message", {
      user: "admin",
      text: `${user.name} welcome to the room ${user.room} :-)`,
    });
    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", text: `${user.name} has joined` });

    socket.join(user.room);
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
    callback();
  });
  //send message we expect message from front end
  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit("message", { user: user.name, text: message });
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name} has left :-(`,
      });
      console.log("user just left!");
    }
  });
});
app.use(router);
app.use(cors());
server.listen(PORT, () => {
  console.log(`server started on port  ${PORT}...`);
});
