"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const server = http_1.default.createServer();
const io = new socket_io_1.Server(server, { cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    } });
io.on('connection', (socket) => {
    console.log("A user connected");
    socket.on('send-delta', (delta) => {
        socket.broadcast.emit('received-delta', delta);
        console.log('sending');
    });
});
server.listen(3000, () => console.log('listening'));
