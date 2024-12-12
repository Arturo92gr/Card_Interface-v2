import { uiDrag } from "./uiDrag.js";
import { Card } from "./Card.js";

// Inicializar la baraja
const baraja = document.querySelector('.baraja');
Card.dealCards(baraja);

// Inicializar el sistema de arrastre
uiDrag.init(".contenedor, .baraja", ".card");

// Cargar estado previo del servidor
await uiDrag.loadState();