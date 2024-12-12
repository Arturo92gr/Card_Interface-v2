import { Card } from './Card.js';

export const uiDrag = {
    // Inicializa el sistema de arrastre
    init: (selectorContainers, selectorCards) => {
        // Configurar los contenedores donde se pueden soltar las cartas
        document.querySelectorAll(selectorContainers).forEach((container) => {
            // Evento cuando una carta se arrastra sobre un contenedor
            container.addEventListener("dragover", (event) => {
                // Obtener el elemento arrastrado directamente
                const draggedElement = document.querySelector('.dragging');
                if (!draggedElement) return;

                const cardPalo = draggedElement.dataset.palo;
                const containerPalo = container.dataset.palo;

                // Permitir arrastrar solo si el palo coincide o es la baraja
                if (containerPalo === cardPalo || container.classList.contains('baraja')) {
                    event.preventDefault();
                    event.dataTransfer.dropEffect = "move";
                } else {
                    event.dataTransfer.dropEffect = "none";
                }
            });

            // Evento cuando se suelta una carta en un contenedor
            container.addEventListener("drop", async (event) => {
                var data = JSON.parse(event.dataTransfer.getData("text"));
                var draggedElement = document.getElementById(data.id);

                var cardPalo = draggedElement.dataset.palo;
                var containerPalo = container.dataset.palo;

                if (containerPalo === cardPalo || container.classList.contains('baraja')) {
                    event.preventDefault();
                    var rect = container.getBoundingClientRect();
                    var offsetX = event.clientX - rect.left;
                    var offsetY = event.clientY - rect.top;

                    draggedElement.style.position = "absolute";
                    draggedElement.style.left = offsetX - (draggedElement.offsetWidth / 2) + "px";
                    draggedElement.style.top = offsetY - (draggedElement.offsetHeight / 2) + "px";

                    if (!container.contains(draggedElement)) {
                        container.appendChild(draggedElement);
                    }

                    // Guardar estado en el servidor
                    await fetch(`http://localhost:3000/api/cards/${draggedElement.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            containerId: container.dataset.palo || 'baraja',
                            position: {
                                left: draggedElement.style.left,
                                top: draggedElement.style.top
                            }
                        })
                    });
                } else {
                    // No hacer nada, impide el drop
                }
            });
        });

        // Configurar las cartas para que sean arrastrables
        document.querySelectorAll(selectorCards).forEach((item) => {
            item.setAttribute("draggable", "true");
            
            // Evento cuando se comienza a arrastrar una carta
            item.addEventListener("dragstart", (event) => {
                // Verificar si es la carta superior en la baraja
                const barajaContainer = event.target.closest('.baraja');
                if (barajaContainer) {
                    const topCard = Card.getTopCard(barajaContainer);
                    // Solo permitir arrastrar la carta superior
                    if (event.target !== topCard) {
                        event.preventDefault();
                        return;
                    }
                }

                // Preparar datos para la transferencia
                const sendData = {
                    id: event.target.id,
                    mensaje: "Esto es una prueba"
                };
                event.target.classList.add('dragging');
                event.dataTransfer.setData("text", JSON.stringify(sendData));
            });

            // Limpiar efectos visuales al terminar el arrastre
            item.addEventListener("dragend", (event) => {
                event.target.classList.remove('dragging');
            });
        });
    },

    // Carga el estado del juego desde el servidor
    loadState: async () => {
        try {
            const response = await fetch('http://localhost:3000/api/state', {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'omit'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const state = await response.json();
            
            // Solo procesar si hay cartas en el estado
            if (state && state.cards) {
                Object.entries(state.cards).forEach(([cardId, cardState]) => {
                    const card = document.getElementById(cardId);
                    const container = document.querySelector(
                        cardState.containerId === 'baraja' 
                            ? '.baraja' 
                            : `[data-palo="${cardState.containerId}"]`
                    );
                    
                    if (card && container) {
                        card.style.position = "absolute";
                        card.style.left = cardState.position.left;
                        card.style.top = cardState.position.top;
                        container.appendChild(card);
                    }
                });
            }
        } catch (error) {
            console.error('Error loading state:', error);
        }
    }
};