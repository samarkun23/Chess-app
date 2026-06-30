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
    private onGameEnd : (gameId: number) => void;


    constructor(player1: { id: number; socket: WebSocket }, player2: { id: number; socket: WebSocket }, onGameEnd: (gameId: number) => void) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();
        this.onGameEnd = onGameEnd;
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
        // ensure correct player's turn
        if (this.moveCount % 2 === 0 && socket !== this.player1.socket) {
            return
        }
        if (this.moveCount % 2 === 1 && socket !== this.player2.socket) {
            return
        }

        // Attempt the move and handle any exceptions / invalid moves gracefully
        let result;
        try {
            result = this.board.move({ ...move, promotion: 'q' });
        } catch (error) {
            console.log("Exception in move (thrown):", move, error);
            // notify the player who attempted the invalid move
            try {
                socket.send(JSON.stringify({ type: "error", payload: { message: "Invalid move format or internal error" } }));
            } catch (_) { /* ignore socket send errors */ }
            return;
        }

        if (!result) {
            console.log("Invalid move attempted (illegal):", move);
            try {
                socket.send(JSON.stringify({ type: "error", payload: { message: "Illegal move" } }));
            } catch (_) { console.error("Failed to send illegal move error message:", _) }
            return;
        }

        // successful move -> update state, persist and broadcast
        this.moveCount++;
        const playerId = socket === this.player1.socket ? this.player1.id : this.player2.id;

        // broadcast move to both players
        try {
            this.player1.socket.send(JSON.stringify({ type: MOVE, payload: move }));
            this.player2.socket.send(JSON.stringify({ type: MOVE, payload: move }));
        } catch (err) {
            console.error("Error broadcasting move:", err);
            // try to rollback board state if broadcast failed catastrophically
            try {
                this.board.undo();
                this.moveCount--;
            } catch (_) { /* best-effort rollback */ }
            return;
        }

        // store move in DB, handle DB errors without leaving the game in a broken state
        try {
            await this.addMoveInDb(move, playerId);
        } catch (err) {
            console.error("Failed to persist move, rolling back:", err);
            // rollback the move and notify players
            try {
                this.board.undo();
                this.moveCount--;
                this.player1.socket.send(JSON.stringify({ type: "error", payload: { message: "Server error, move reverted" } }));
                this.player2.socket.send(JSON.stringify({ type: "error", payload: { message: "Server error, move reverted" } }));
            } catch (_) { console.error("Error in rollback of moves:", _) }
            return;
        }

        // check for game over after a successful, persisted move
        if (this.board.isGameOver()) {
            let winner: "white" | "black" | "draw" = "draw";
            let resultEnum: "WHITE_WIN" | "BLACK_WIN" | "DRAW" = "DRAW";
            let winnerId: number | null = null;

            if (this.board.isCheckmate()) {
                winner = this.board.turn() === "w" ? "black" : "white";
                resultEnum = winner === "white" ? "WHITE_WIN" : "BLACK_WIN";
                winnerId = winner === "white" ? this.player1.id : this.player2.id;
            } else if (this.board.isDraw()) {
                winner = "draw";
                resultEnum = "DRAW";
                winnerId = null;
            }

            try {
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
            } catch (err) {
                console.error("Failed to broadcast game over:", err);
            }

            try {
                await prismaClient.game.update({
                    where: { id: Number(this.gameId) },
                    data: {
                        endedAt: new Date(),
                        result: resultEnum,
                        winnerId: winnerId
                    }
                })
            } catch (err) {
                console.error("Failed to update game result in DB:", err);
            }

            this.onGameEnd(Number(this.gameId));
        }
    }
}
