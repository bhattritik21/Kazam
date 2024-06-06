import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import taskHandlers from './socket/taskHandlers';
import taskRoutes from './routes/tasks';
import { initializeMongo } from './db/mongoClient';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.use(cors());

io.on('connection', (socket) => {
  taskHandlers(socket);
});

app.use(taskRoutes);

initializeMongo().then(() => {
  server.listen(5000, () => {
    console.log(`Server listening at http://localhost:5000`);
  });
});
