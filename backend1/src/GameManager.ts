import {WebSocket} from "ws";
import { INIT_GAME, MOVE } from "./messages.js";
import { Game } from "./Game.js";


export class GameManager{
    private games: Game[];
    private pendingUser: WebSocket | null; // a user who is currently waiting to be connected 
    private users: WebSocket[]; // list of active user on server

    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }

    addUser(socket: WebSocket) {
        this.users.push(socket)
        this.addHandler(socket)
    }

    removeUser(socket: WebSocket){
        this.users = this.users.filter(user => user !== socket);
        // stop the game here bec the user left

    }
    
    private addHandler(socket: WebSocket) {
        socket.on("message", (data) => {

            const message = JSON.parse(data.toString());

            if(message.type === INIT_GAME){
                if(this.pendingUser){
                    // start game 
                    const game = new Game(this.pendingUser, socket);
                    this.games.push(game);
                    this.pendingUser = null;
                }else{
                    this.pendingUser = socket;
                }
            }

            if(message.type === MOVE){
                console.log(message.type , "This is the move")
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if(game){
                    console.log("inside makemove");
                    game.makeMove(socket, message.payload.move);

                }
            }
        }) 
    }
}