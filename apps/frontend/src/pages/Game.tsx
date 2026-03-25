import { useEffect, useRef, useState, type JSX } from "react";
import { Button } from "../components/Button"
import { ChessBoard } from "../components/ChessBoard"
import { useSocket } from "../hook/useSocket"
import { Chess } from 'chess.js'
import { GameSidebar } from "../components/GameSidebar";
import { GameOver } from "../components/Gameover";

//
export const INIT_GAME = 'init_game';
export const MOVE = 'move';
export const GAME_OVER = 'game_over';


interface Metadata {
    blackPlayer: string;
    whitePlayer: string
}

export interface GameOverMetadata {
    winner: string;
}

export const Game = () => {
    const socket = useSocket();
    console.log(socket)
    const [chess, setChess] = useState(new Chess())
    const [board, setBoard] = useState(chess.board());
    const [started, setStarted] = useState(false)
    const [gameOver, setGameOver] = useState(false)
    const [gameOverMetadata, setGameOverMetadata] = useState<GameOverMetadata | null>(null)
    const [gameMetadata, setGameMetadata] = useState<Metadata | null>(null)
    const [moves, setMoves] = useState<{ from: string; to: string; player?: string }[]>([])

    function isOpen(ws: WebSocket) {
        return ws.readyState === ws.OPEN
    }

    useEffect(() => {
        if (!socket) {
            return
        }
        const handleMessage = (event: MessageEvent) => {

            const message = JSON.parse(event.data);

            console.log(message)

            switch (message.type) {
                case INIT_GAME:
                    setBoard(chess.board())
                    setStarted(true);
                    setGameMetadata({
                        blackPlayer: message.payload.blackPlayer,
                        whitePlayer: message.payload.whitePlayer,
                    })
                    break;

                case MOVE:
                    const move = message.payload;
                    chess.move(move)
                    setBoard(chess.board())
                    console.log("move made", message.payload.from);
                    setMoves(prevMoves => [...prevMoves, move])
                    console.log("move made", move.from, "->", move.to);
                    // const move = message.payload;
                    // chess.move(move);
                    // setBoard([...chess.board()]);
                    break;

                case GAME_OVER:
                    console.log("Game over");
                    setGameOver(true);
                    setGameOverMetadata({
                        winner: message.payload.winner
                    })
                    break;
            }

        }

        socket.addEventListener('message', handleMessage);

        return () => {
            socket.removeEventListener('message', handleMessage)
        }
    }, [socket])

    if (!socket) return <div>

    </div>


    return <div className="flex gap-20">

        {gameOver && <GameOver winner={gameOverMetadata?.winner!}/>}
        <GameSidebar />
        <div className="flex justify-center ">

            <div className="pt-8 max-w-screen-lg w-full ">
                <span className=" flex justify-center mb-5 text-2xl text-white/90 ">
                    {gameMetadata?.whitePlayer} vs {gameMetadata?.blackPlayer}
                </span>
                <div className="grid grid-cols-6 gap-4 md:grid-cols-2  w-full">

                    <div className="cols-span-4 w-full flex justify-center">
                        <ChessBoard board={board} socket={socket} setBoard={setBoard} chess={chess} />
                    </div>
                    <div className=" w-full justify-center bg-white/10 rounded-2xl">
                        <div className="pt-10 flex justify-center" >
                            {!started && <Button onClick={() => {
                                if (!isOpen(socket)) return;
                                socket.send(JSON.stringify({
                                    type: INIT_GAME
                                }))
                            }} >Play</Button>}
                        </div>

                        <div className="text-white text-xl font-semibold pt-4 pb-2 flex justify-center">
                            Moves
                        </div>

                        <div className="pt-1 pb-1 moves-render">
                            {(() => {
                                const rows: JSX.Element[] = [];
                                for (let i = 0; i < moves.length; i += 2) {
                                    const white = moves[i];
                                    const black = moves[i + 1];
                                    rows.push(
                                        <div key={i} className="flex col-auto w-full justify-between px-5 text-white text-lg text-shadow-lg text-stroke-sm text-bold">
                                            <span>{i / 2 + 1}. {white ? `${white.from} -> ${white.to}` : ""}</span>
                                            <span>{black ? ` ${black.from} -> ${black.to}` : ""}</span>
                                        </div>
                                    );
                                }
                                return rows;
                            })()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}