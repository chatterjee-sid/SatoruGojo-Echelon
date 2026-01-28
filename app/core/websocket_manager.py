from fastapi import WebSocket
from typing import List
import logging

logger = logging.getLogger(__name__)

class ConnectionManager:
    def __init__(self):
        # List to keep track of active WebSocket connections
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        """Accepts a new connection and adds it to the list."""
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"New WebSocket connection. Total: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        """Removes a closed connection from the list."""
        self.active_connections.remove(websocket)
        logger.info(f"WebSocket disconnected. Total: {len(self.active_connections)}")

    async def broadcast_alert(self, message: dict):
        """Sends a JSON message to all active clients."""
        logger.warning(f"BROADCASTING ALERT: {message}")
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.error(f"Failed to broadcast to a connection: {e}")
                # Optional: handle failed connections here (e.g., remove them)

# Singleton instance to be used across the app
manager = ConnectionManager()
