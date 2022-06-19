import React from "react";
import { useState, useEffect } from "react";
//import queryString from "query-string";
import io from "socket.io-client";
import "./chat.css";
import { useLocation } from "react-router-dom";
import InfoBar from "../InfoBar/InfoBar.js";
import Input from "../Input/Input.js";
import Messages from "../Messages/Messages.js";
//import TextContainer from "../TextContainer/TextContainer";

let socket;
const Chat = () => {
  const ENDPOINT = "https://dagim-cherinet-react-chat-app.herokuapp.com/";
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  // const [users, setUsers] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const location = useLocation();
  useEffect(() => {
    console.log(location.state);
    const { name, room } = location.state;

    // socket = io(ENDPOINT);
    socket = io(ENDPOINT, {
      transports: ["websocket", "polling", "flashsocket"],
    });

    setName(name);
    setRoom(room);
    console.log(name, room);
    console.log(socket);
    socket.emit("join", { name, room }, () => {});

    return () => {
    //  socket.emit("disconnect");
      socket.off();
    };
  }, [ENDPOINT, location.state]);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });
    //socket.on("roomData", ({ users }) => {
    // setUsers(users);
    //});
  }, [message, messages]);

  // function to send message/
  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };
  console.log(messages);

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
      {/* <TextContainer users={users} /> */}
    </div>
  );
};

export default Chat;
