import express from 'express';
import { Coordinate } from '../../shared/chesslib/Coordinate';

const app = express();
app.set('port', process.env.PORT || 3000);

const http = require('http').Server(app);
const io = require('socket.io')(http);

// simple '/' endpoint sending a Hello World
// response
app.get('/', (req: any, res: any) => {
  res.send('hello world');
});

io.on('connection', (socket: any) => {
  console.log('a user connected');
  io.emit('board-update', 'FUCK YOU');

  socket.on('make-move', (coordinates: Coordinate[]) => {
    console.log(coordinates);
    io.emit('board-update', null);
  });
});

// start our simple server up on localhost:3000
const server = http.listen(3000, () => {
  console.log('listening on *:3000');
});
