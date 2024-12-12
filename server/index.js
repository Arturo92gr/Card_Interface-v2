import express from 'express';
import cors from 'cors';

// Configuración inicial del servidor Express
const app = express();
const port = 3000;

// Configuración CORS para permitir peticiones desde el cliente
app.use((req, res, next) => {
    // Permitir peticiones desde cualquier origen
    res.header('Access-Control-Allow-Origin', '*');
    // Métodos HTTP permitidos
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    // Cabeceras permitidas
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // Manejar peticiones OPTIONS para CORS preflight
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Middleware para procesar JSON
app.use(express.json());

// Estado global del juego - almacena posición de cada carta
let gameState = {
    cards: {}
};

// API endpoints
// GET: Obtener estado actual del juego
app.get('/api/state', (req, res) => {
    res.json(gameState);
});

// POST: Actualizar estado completo del juego
app.post('/api/state', (req, res) => {
    gameState = req.body;
    res.json({ success: true });
});

// PUT: Actualizar posición de una carta específica
app.put('/api/cards/:cardId', (req, res) => {
    const { cardId } = req.params;
    const cardState = req.body;
    gameState.cards[cardId] = cardState;
    res.json({ success: true });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
