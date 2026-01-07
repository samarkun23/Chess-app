import { WebSocketServer } from 'ws'
import { GameManager } from './GameManager.js';

const wss = new WebSocketServer({ port: 3000 });

const gameManager = new GameManager();

wss.on('connection', function connection(ws) {
    ws.on('error', console.error);

    gameManager.addUser(ws)
    ws.on("disconnect", () => gameManager.removeUser(ws))
})
 





















