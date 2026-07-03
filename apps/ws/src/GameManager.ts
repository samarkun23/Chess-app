import { WebSocket } from "ws";
import { INIT_GAME, MOVE } from "./messages.js";
import { Game } from "./Game.js";
import { AuthWebSocket } from "./middleware/authMiddleware.js";

export class GameManager {
    private games: Game[];
    private pendingUser: { id: number, socket: WebSocket, connected: boolean, disconnectedTimer?: NodeJS.Timeout } | null; // a user who is currently waiting to be connected 
    private users: WebSocket[]; // list of active user on server

    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }

    private removeGame(gameId: number) {
        this.games = this.games.filter(g => Number(g.gameId) !== gameId);
        console.log(`Game ${gameId} removed. Active games: ${this.games.length}`);
    }

    addUser(socket: AuthWebSocket) {
        if (!socket.userId) {
            socket.close()
            return;
        }
        this.users.push(socket)
        this.addHandler(socket, Number(socket.userId))
    }

    removeUser(socket: WebSocket) {
        this.users = this.users.filter(user => user !== socket);
        // if we cannot find a match and user is in the pending queue

        if (this.pendingUser?.socket === socket) {
            this.pendingUser = null;
            return;
        }
        // stop the game here bec the user left
        const game = this.games.find(g => g.player1.socket === socket || g.player2.socket === socket);
        if (game) {
            game.handleDisconnect(socket);
        }
    }

    private addHandler(socket: WebSocket, userId: number, connected: boolean = true) {
        {

            const user = { id: userId, socket, connected };

            socket.on("message", (data) => {

                const message = JSON.parse(data.toString());
                console.log(message);

                if (message.type === INIT_GAME) {
                    if (this.pendingUser) {
                        if (this.pendingUser.id === user.id) { // FIX : User cannot play with them self 
                            return;
                        };
                        // start game 
                        const game = new Game(this.pendingUser, user, (gameId: number) => {
                            this.removeGame(gameId)
                        });
                        this.games.push(game);
                        this.pendingUser = null;
                        game.initGame();
                    } else {
                        this.pendingUser = user;
                    }
                }

                if (message.type === MOVE) {
                    console.log(message.type, "This is the move")
                    const game = this.games.find(game => game.player1.socket === socket || game.player2.socket === socket);
                    if (game) {
                        console.log("inside makemove");
                        game.makeMove(socket, message.payload.move);

                    }
                }

                if (message.type === "RECONNECT") {
                    console.log("Inside the reconnect");
                    const game = this.games.find(g => g.player1.id === userId || g.player2.id === userId);
                    console.log(game);
                    if (game) {
                        const reconnect = game.handleReconnect(userId, socket);
                        if (!reconnect) {
                            socket.send(JSON.stringify({ type: "error", message: "No game to reconnect to" }));
                        }
                    }
                }
            })
        }
    };


}
