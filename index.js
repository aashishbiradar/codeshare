const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.on('codeChange', (payload) => {
    console.log('codeChange:\n' + payload);
    socket.broadcast.emit('codeChange', payload);
  });
});

http.listen(port, () => console.log(`listening on port ${port}`));