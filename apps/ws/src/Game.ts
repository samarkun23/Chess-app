import { WebSocket } from "ws";
import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages.js";

export class Game {
    public player1: WebSocket;
    public player2: WebSocket;
    private board: Chess;
    private startTime: Date;
    private moveCount = 0;


    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "white"
            }
        }))
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "black"
            }
        }))
    }

    makeMove(socket: WebSocket, move: { from: string, to: string }) {
        // validation , is this user move, is the move valid , than update the board push the move and check the game is over ? and send the upadated board to both of them 
        //now for this all the validation we use chess library . 

        if (this.moveCount % 2 === 0 && socket !== this.player1) {
            return
        }
        if (this.moveCount % 2 === 1 && socket !== this.player2) {
            return
        }

        // validation
        try {
            const result = this.board.move({...move, promotion: 'q'});
            if (!result) {
                console.log("Invalid move attempted:", move);
                return;
            }
            
        } catch (error) {
            console.log("Exception in move", move, error)
            return;
        }


        this.moveCount++;
        //board is autometically updating throw a library

        // checking th game is over 
        this.player1.send(JSON.stringify({ type: MOVE, payload: move }));
        this.player2.send(JSON.stringify({ type: MOVE, payload: move }));

        // move 

        if (this.board.isGameOver()) {
            const winner = this.board.turn() === "w" ? "black" : "white";
            this.player1.send(JSON.stringify({ type: GAME_OVER, payload: { winner } }));
            this.player2.send(JSON.stringify({ type: GAME_OVER, payload: { winner } }));
        }
    }
}
