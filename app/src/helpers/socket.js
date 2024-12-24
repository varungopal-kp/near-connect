import { io } from 'socket.io-client';

const socket = io('http://localhost:8000', {
  withCredentials: true, // Matches the server's CORS settings
  transports: ['websocket'], // Optional: Use WebSocket directly
});

export default socket;
