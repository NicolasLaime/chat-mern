import { Server } from "socket.io";
import http from 'http';
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173'],
        methods: ["GET", "POST"]
    }
});

// Mapa de sockets de usuarios
const userSocketMap = {};

// Función para obtener el ID de socket del receptor
export const getReciverSocketId = (reciverId) => {
    return userSocketMap[reciverId]; // Acceso al objeto, no como función
};

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;

    // Asegurarse de que userId esté definido antes de asignarlo al mapa
    if (userId !== 'undefined') {
        userSocketMap[userId] = socket.id;
    }

    // Emitir usuarios en línea a todos los clientes
    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    // Manejo de desconexión
    socket.on('disconnect', () => {
        delete userSocketMap[userId];
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});

export { app, io, server };
