import { Card } from "./models/Card.js";
import { DragController } from "./controllers/DragController.js";
import { GameStateService } from "./services/GameStateService.js";

async function initializeGame() {
    // Inicializar la baraja
    const baraja = document.querySelector('.baraja');
    Card.dealCards(baraja);

    // Inicializar el controlador de arrastre
    const dragController = new DragController();

    // Cargar estado previo
    const state = await GameStateService.getState();
    if (state) {
        dragController.applyState(state);
    }
}

initializeGame();