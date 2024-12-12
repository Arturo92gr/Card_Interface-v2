import { Card } from "./models/Card.js";
import { DragController } from "./controllers/DragController.js";
import { GameStateService } from "./services/GameStateService.js";

async function initializeGame() {
    // Inicializar Socket.IO
    GameStateService.init();

    // Inicializar la baraja
    const baraja = document.querySelector('.baraja');
    Card.dealCards(baraja);

    // Inicializar el controlador de arrastre
    new DragController();
}

initializeGame();