import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Replace with your backend server URL

const Multiplayer = () => {
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const joinRoom = () => {
    if (room.trim() !== '') {
      socket.emit('join_room', room);
    }
  };

  const sendMessage = () => {
    if (message.trim() !== '') {
      socket.emit('send_message', { room, message });
      setMessage('');
    }
  };

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data.message]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, []);

  return (
    <div className="multiplayer-container p-6 bg-gradient-to-b from-[#2963A2] to-[#72C2C9] min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Multiplayer</h1>
      <div className="join-room mb-6">
        <input
          type="text"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="Enter Room Code"
          className="w-full p-3 rounded-lg text-black"
        />
        <button
          onClick={joinRoom}
          className="mt-2 px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          Join Room
        </button>
      </div>
      <div className="chat-section">
        <div className="messages mb-4 p-4 bg-white text-black rounded-lg">
          {messages.map((msg, index) => (
            <p key={index}>{msg}</p>
          ))}
        </div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="w-full p-3 rounded-lg text-black"
        />
        <button
          onClick={sendMessage}
          className="mt-2 px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Multiplayer;