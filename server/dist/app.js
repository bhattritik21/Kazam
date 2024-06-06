"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const taskHandlers_1 = __importDefault(require("./socket/taskHandlers"));
const tasks_1 = __importDefault(require("./routes/tasks"));
const mongoClient_1 = require("./db/mongoClient");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true
    }
});
app.use((0, cors_1.default)());
io.on('connection', (socket) => {
    (0, taskHandlers_1.default)(socket);
});
app.use(tasks_1.default);
(0, mongoClient_1.initializeMongo)().then(() => {
    server.listen(5000, () => {
        console.log(`Server listening at http://localhost:5000`);
    });
});
