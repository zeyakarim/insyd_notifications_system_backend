const { initNotificationService } = require("./app/api/notifications/services");
const app = require("./app/api/app");
require("dotenv").config();
const { Server } = require("socket.io");

let server;
server = app.listen(process.env.PORT, () => {
    console.log(
        `PID: ${process.pid}, Now browse to 'http://localhost:${process.env.PORT}'`,
    );
});
let io;

io = new Server(server, {
    pingTimeout: 60000,
    cors: {
      origin: process.env.origin,
    },
});

io.on('connection', (socket) => {
    socket.on('register-session', (sessionId) => {
        socket.join(sessionId);
        console.log(`Socket connected for session: ${sessionId}`);
    });
});

initNotificationService(io);