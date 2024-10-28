import {Server} from "socket.io"
import http from "http"
import cors from "cors"

const server = http.createServer()
const io = new Server(server, {cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
}})
io.on('connection',(socket) =>{
    console.log("A user connected")
    socket.on('send-delta',(delta) => {
        socket.broadcast.emit('received-delta',delta)
        console.log('sending')
    })
})
server.listen(3000,() => console.log('listening'))

