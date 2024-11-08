import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';  // Importa CORS
import connectDb from './database/connectDB.js';
import authRouter from './routes/authUser.js';
import userRoute from './routes/userRoute.js';
import messageRouter from './routes/messageRoute.js';
import cookieParser from 'cookie-parser';
import { app, server } from './socket/socket.js';
import path from 'path'

const __dirname = path.resolve()

dotenv.config();

// Middleware para CORS
app.use(cors({
    origin: 'https://chat-mern-iota.vercel.app/', // 
    credentials: true  // Permite cookies y otros headers de autenticación
}));

// Middleware para parsear JSON y cookies
app.use(express.json());
app.use(cookieParser());

// Rutas
app.use('/api/auth', authRouter);
app.use('/api/message', messageRouter);
app.use('/api/user', userRoute);

app.get('/', (req, res) => {
    res.send('Server trabajando');
});

// Conexión y escucha del servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
    await connectDb();
    console.log(`Trabajando en el puerto ${PORT}`);
});
