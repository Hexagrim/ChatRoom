const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

// In-memory store for chat history
const chatHistory = [];

io.on('connection', (socket) => {
  console.log('A user connected');

  // Send existing chat history to the new user
  socket.emit('chat history', chatHistory);

  socket.on('chat message', ({ username, message }) => {
    const chatMessage = { username, message };
    chatHistory.push(chatMessage);
    io.emit('chat message', chatMessage);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
