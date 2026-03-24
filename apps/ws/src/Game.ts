import { WebSocket } from "ws";
import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages.js";
import { randomUUID } from 'crypto'
import { prismaClient } from '@repo/db/client'

export class Game {
    public gameId!: Number;
    public player1: { id: number, socket: WebSocket };
    public player2: { id: number, socket: WebSocket };
    private board: Chess;
    private startTime: Date;
    private moveCount = 0;


    constructor(player1: { id: number; socket: WebSocket }, player2: { id: number; socket: WebSocket }) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();
    }

    async initGame() {

        try {
            await this.createGameInDb();
        } catch (error) {
            console.log("Error while create a game in Db", error)
            return;
        }

        const users = await prismaClient.user.findMany({
            where: {
                id: {
                    in: [this.player1.id, this.player2.id]
                }
            }
        });

        if (this.player1) {
            this.player1.socket.send(JSON.stringify({
                type: INIT_GAME,
                payload: {
                    color: "white",
                    gameId: this.gameId,
                    whitePlayer: users.find(user => user.id === this.player1.id)?.username,
                    blackPlayer: users.find(user => user.id === this.player2.id)?.username
                }
            }))
        }
        if (this.player2) {
            this.player2.socket.send(JSON.stringify({
                type: INIT_GAME,
                payload: {
                    color: "black",
                    gameId: this.gameId,
                    whitePlayer: users.find(user => user.id === this.player1.id)?.username,
                    blackPlayer: users.find(user => user.id === this.player2.id)?.username
                }
            }))
        }
    }

    async createGameInDb() {
        const game = await prismaClient.game.create({
            data: {
                whiteId: this.player1.id,
                blackId: this.player2.id
            }
        })
        this.gameId = game.id;
    }

    async addMoveInDb(move: {
        from: string,
        to: string
    }, playerId: number) {
        await prismaClient.move.create({
            data: {
                gameId: Number(this.gameId),
                playerId,
                from: move.from,
                to: move.to
            }
        })
    }

    async makeMove(socket: WebSocket, move: { from: string, to: string }) {
        // validation , is this user move, is the move valid , than update the board push the move and check the game is over ? and send the upadated board to both of them 
        //now for this all the validation we use chess library . 

        if (this.moveCount % 2 === 0 && socket !== this.player1.socket) {
            return
        }
        if (this.moveCount % 2 === 1 && socket !== this.player2.socket) {
            return
        }

        // validation
        try {
            const result = this.board.move({ ...move, promotion: 'q' });
            if (!result) {
                console.log("Invalid move attempted:", move);
                return;
            }
            console.log("this is legal moves");
            console.log(move);

        } catch (error) {
            console.log("Exception in move", move, error)
            return;
        }


        this.moveCount++;
        //board is autometically updating throw a library

        // checking th game is over 
        this.player1.socket.send(JSON.stringify({ type: MOVE, payload: move }));
        this.player2.socket.send(JSON.stringify({ type: MOVE, payload: move }));

        // store move in DB . 
        const playerId = socket === this.player1.socket ? this.player1.id : this.player2.id;
        await this.addMoveInDb(move, playerId);

        // move 

        if (this.board.isGameOver()) {
            let winner: "white" | "black" | "draw" = "draw";
            let resultEnum: "WHITE_WIN" | "BLACK_WIN" | "DRAW" = "DRAW";
            let winnerId: number | null = null;

            if (this.board.isCheckmate()) {
                winner = this.board.turn() === "w" ? "black" : "white";
                resultEnum = winner === "white" ? "WHITE_WIN" : "BLACK_WIN";
                winnerId = winner === "white" ? this.player1.id : this.player2.id;
            } else if (this.board.isDraw()) {
                winner = "draw",
                    resultEnum = "DRAW",
                    winnerId = null;
            }

            this.player1.socket.send(JSON.stringify({
                type: GAME_OVER,
                payload: { 
                    winner
                }
            }));

            this.player2.socket.send(JSON.stringify({
                type: GAME_OVER,
                payload: { 
                    winner
                 }
            }));

            await prismaClient.game.update({
                where: {id : Number(this.gameId)},
                data: {
                    endedAt: new Date(),
                    result: resultEnum,
                    winnerId: winnerId
                }
            })

        }
    }
}
