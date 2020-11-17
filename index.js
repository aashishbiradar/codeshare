const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.use(express.static('public'))

io.on('connection', (socket) => {
  socket.on('join', ({ shareId }) => {
    socket.broadcast.to(shareId).emit('newUser', socket.id);
    socket.join(shareId);
    socket.on('codeChange', ({ socketId, shareId, payload }) => {
      if (socketId) {
        console.log(`socketId: ${socketId}, codeChange:\n${payload}`);
        io.to(socketId).emit('codeChange', payload);
      } else {
        console.log(`shareId: ${shareId}, codeChange:\n${payload}`);
        socket.broadcast.to(shareId).emit('codeChange', payload);
      }
    });
  });
});

http.listen(port, () => console.log(`listening on port ${port}`));