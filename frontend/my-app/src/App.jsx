import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

// Connect to backend
const socket = io("http://localhost:5000");

function App() {
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Join room
  const joinRoom = () => {
    if (roomId.trim() !== "") {
      socket.emit("join_room", roomId);
      setJoined(true);
    }
  };

  // Send message
  const sendMessage = () => {
    if (message.trim() !== "") {
      const msgData = {
        roomId,
        sender: "Yashwanth",
        message,
        time: new Date().toLocaleTimeString(),
      };

      socket.emit("send_message", msgData);
      setMessages((prev) => [...prev, msgData]);
      setMessage("");
    }
  };

  // Receive messages
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("receive_message");
  }, []);

  return (
    <div className="app">
      <h1>💬 Real-Time Chat</h1>

      {!joined ? (
        <div className="join">
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button onClick={joinRoom}>Join Room</button>
        </div>
      ) : (
        <div className="chat">
          <div className="messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${
                  msg.sender === "Yashwanth" ? "own" : ""
                }`}
              >
                <p>{msg.message}</p>
                <span>{msg.time}</span>
              </div>
            ))}
          </div>

          <div className="input-box">
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
