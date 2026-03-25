import { SQUARES, type Color, type PieceSymbol, type Square } from "chess.js"
import { useState } from "react";
import { MOVE } from "../pages/Game";

export const ChessBoard = ({ board, socket, setBoard, chess }: {
    chess: any;
    board: ({
        square: Square,
        type: PieceSymbol,
        color: Color;
    } | null)[][];
    socket: WebSocket;
    setBoard: any;
}) => {

    const [from, setFrom] = useState<null | Square>(null);

    return <div className="rounded-lg overflow-hidden shadow-lg">
        {board.map((row, i) => {
            return <div key={i} className="flex">
                {row.map((square, j) => {

                    const squareRepresentation = String.fromCharCode(97 + (j % 8)) + "" + (8 - i) as Square;

                    return <div onClick={() => {
                        if (!from) {
                            setFrom(squareRepresentation);
                        } else {
                            socket.send(JSON.stringify({
                                type: MOVE,
                                payload: {
                                    move: {
                                        from,
                                        to : squareRepresentation
                                    }
                                }
                            }))
                            setFrom(null)

                        }
                    }} key={j} className={`w-16 h-16 ${(i + j) % 2 ? 'bg-green-600' : 'bg-green-100'} `}>
                        <div className="w-full justify-center flex h-full">
                            <div className="h-full justify-center flex flex-col">
                                {square ? <img className="w-10" src={`/${square.color === 'b' ? square?.type : `${square?.type?.toUpperCase()} copy`}.png`} /> : null}
                            </div>
                        </div>
                    </div>
                })}
            </div>
        })}
    </div>
}