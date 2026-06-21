import { SQUARES, type Color, type PieceSymbol, type Square } from "chess.js"
import { useState } from "react";
import { MOVE } from "../pages/Game";

export const ChessBoard = ({ board, socket, setBoard, chess, playerColor }: {
    chess: any;
    board: ({
        square: Square,
        type: PieceSymbol,
        color: Color;
    } | null)[][];
    socket: WebSocket;
    setBoard: any;
    playerColor?: "white" | "black" | null;
}) => {

    const [from, setFrom] = useState<null | Square>(null);

    const isBlack = playerColor === "black";
    const rowIndices = isBlack ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];
    const colIndices = isBlack ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];

    return <div className="rounded-lg overflow-hidden shadow-lg">
        {rowIndices.map((i) => {
            return <div key={i} className="flex">
                {colIndices.map((j) => {
                    const square = board[i][j];
                    const squareRepresentation = String.fromCharCode(97 + (j % 8)) + "" + (8 - i) as Square;

                    return <div onClick={() => {
                        if (!from) {
                            const piece = chess.get(squareRepresentation);
                            if (piece && piece.color === chess.turn()) {
                                setFrom(squareRepresentation);
                            }
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
                    }} key={j} className={`w-16 h-16 ${(i + j) % 2 ? 'bg-green-600' : 'bg-green-100'} ${from === squareRepresentation ? 'border-4 border-yellow-400' : ''}`}>
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