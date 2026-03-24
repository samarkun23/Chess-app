import {WebSocket} from "ws";
import { INIT_GAME, MOVE } from "./messages.js";
import { Game } from "./Game.js";
import { AuthWebSocket } from "./middleware/authMiddleware.js";

export class GameManager{
    private games: Game[];
    private pendingUser: {id: number, socket: WebSocket} | null; // a user who is currently waiting to be connected 
    private users: WebSocket[]; // list of active user on server

    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }

    addUser(socket: AuthWebSocket) {
        if(!socket.userId){
            socket.close()
            return;
        }
        this.users.push(socket)
        this.addHandler(socket, Number(socket.userId))
    }

    removeUser(socket: WebSocket){
        this.users = this.users.filter(user => user !== socket);
        // stop the game here bec the user left

    }
    
    private addHandler(socket: WebSocket,userId: number) {

        const user = {id:userId ,socket};

        socket.on("message", (data) => {

            const message = JSON.parse(data.toString());

            if(message.type === INIT_GAME){
                if(this.pendingUser){
                    // start game 
                    const game = new Game(this.pendingUser, user);
                    this.games.push(game);
                    this.pendingUser = null;
                    game.initGame();
                }else{
                    this.pendingUser = user;
                }
            }

            if(message.type === MOVE){
                console.log(message.type , "This is the move")
                const game = this.games.find(game => game.player1.socket === socket || game.player2.socket === socket);
                if(game){
                    console.log("inside makemove");
                    game.makeMove(socket, message.payload.move);

                }
            }
        }) 
    }
}