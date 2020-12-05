const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.static('public'));
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
  }
});

const port = process.env.PORT || 3000;

io.on('connection', (socket) => {
  socket.on('join', ({ shareId }) => {
    socket.broadcast.to(shareId).emit('newUser', socket.id);
    socket.join(shareId);
    socket.on('codeChange', ({ socketId, shareId, payload }) => {
      if (socketId) {
        io.to(socketId).emit('codeChange', payload);
      } else {
        socket.broadcast.to(shareId).emit('codeChange', payload);
      }
    });
  });
});

http.listen(port, () => console.log(`listening on port ${port}`));