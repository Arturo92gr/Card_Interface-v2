/**
 * Servidor Express que gestiona el estado del juego
 * Proporciona una API REST para sincronizar el estado entre clientes
 */

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

// Configuración inicial del servidor Express
const app = express();
const httpServer = createServer(app);

// Configuración actualizada de CORS para Socket.IO
const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:5500", "http://127.0.0.1:5500", "http://localhost:3000", "http://127.0.0.1:3000"],
        methods: ["GET", "POST", "PUT"],
        allowedHeaders: ["Content-Type"],
        credentials: true
    }
});

// Configuración CORS para Express
app.use(cors({
    origin: ["http://localhost:5500", "http://127.0.0.1:5500", "http://localhost:3000", "http://127.0.0.1:3000"],
    methods: ["GET", "POST", "PUT", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

// Middleware para procesar JSON
app.use(express.json());

/**
 * Estado global del juego
 * Almacena la posición de cada carta por su ID
 * @type {Object}
 */
let gameState = {
    cards: {}
};

// Configuración de Socket.IO
io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);

    // Enviar estado actual al cliente que se conecta
    socket.emit('initialState', gameState);

    // Escuchar actualizaciones de posición de cartas
    socket.on('updateCardPosition', ({ cardId, containerId, position }) => {
        gameState.cards[cardId] = { containerId, position };
        // Emitir la actualización a todos los clientes excepto al emisor
        socket.broadcast.emit('cardMoved', { cardId, containerId, position });
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
    });
});

// Endpoints de la API
/**
 * GET /api/state - Obtiene el estado actual del juego
 */
app.get('/api/state', (req, res) => {
    res.json(gameState);
});

/**
 * POST /api/state - Actualiza el estado completo del juego
 */
app.post('/api/state', (req, res) => {
    gameState = req.body;
    res.json({ success: true });
});

/**
 * PUT /api/cards/:cardId - Actualiza la posición de una carta específica
 */
app.put('/api/cards/:cardId', (req, res) => {
    const { cardId } = req.params;
    const cardState = req.body;
    gameState.cards[cardId] = cardState;
    res.json({ success: true });
});

// Iniciar el servidor
const port = 3000;
httpServer.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
