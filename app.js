const express = require('express');
const socket = require('socket.io');
const fs = require('fs');

const PORT = process.env.PORT || 4000;

let totalConnections = [];

const app = express();
app.use(express.static('public'));

const server = app.listen(PORT, err => {
  if (err) throw err;
  console.log(`Server running on port ${PORT}`)
});

const io = socket(server);

io.sockets.on('connection', socket => {
  totalConnections.push(socket.id);
  console.log(`New connection (ID): ${socket.id}, TOTAL : ${totalConnections.length}`);
  
  socket.on('play', status => {
    console.log("User played:", status);
    io.emit('play', status);
  });

  socket.on('pause', status => {
    console.log("User paused:", status);
    io.emit('pause', status);
  });

  socket.on('stop', status => {
    console.log("User stopped:", status);
    io.emit('stop', status);
  });

  socket.on('volume', volume => {
    console.log("User changed volume:", volume);
    io.emit('volume', volume);
  })

});

