const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'));
app.get('/*', (req,res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
  }
});

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