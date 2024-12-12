/**
 * Servicio que maneja la comunicación con el servidor
 * Gestiona la persistencia del estado del juego
 */
export class GameStateService {
    /** URL base de la API */
    static API_URL = 'http://localhost:3000/api';

    /**
     * Obtiene el estado actual del juego desde el servidor
     * @returns {Promise<Object|null>} Estado del juego o null si hay error
     */
    static async getState() {
        try {
            const response = await fetch(`${this.API_URL}/state`, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'omit'
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        } catch (error) {
            console.error('Error fetching state:', error);
            return null;
        }
    }

    /**
     * Actualiza la posición de una carta en el servidor
     * @param {string} cardId - ID de la carta
     * @param {string} containerId - ID del contenedor
     * @param {Object} position - Nueva posición {left, top}
     * @returns {Promise<Object|null>} Respuesta del servidor o null si hay error
     */
    static async updateCardPosition(cardId, containerId, position) {
        try {
            const response = await fetch(`${this.API_URL}/cards/${cardId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    containerId,
                    position
                })
            });
            return response.json();
        } catch (error) {
            console.error('Error updating card position:', error);
            return null;
        }
    }
}
