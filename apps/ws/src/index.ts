import { WebSocketServer, WebSocket } from 'ws'
import { GameManager } from './GameManager.js';
import { authMiddleware, AuthWebSocket } from './middleware/authMiddleware.js';
import { IncomingMessage } from 'http';

const wss = new WebSocketServer({ port: 3000 });

const gameManager = new GameManager();

wss.on('connection', function connection(ws: AuthWebSocket, req: IncomingMessage) {
    console.log("ws running on port 3000")
    try {
        ws.on('error', console.error);

        const isAuthenticated = authMiddleware(ws,req);
        if(!isAuthenticated) return;

        console.log("user connected", ws.userId);
        gameManager.addUser(ws)

        ws.on('close', () => {
            console.log("user disconnected", ws.userId);
            gameManager.removeUser(ws);
        });

    } catch (error) {
        console.log(error, "Error in ws ")
    }

})



