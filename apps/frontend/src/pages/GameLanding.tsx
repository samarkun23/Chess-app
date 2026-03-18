import { useEffect, useState } from "react";
import { useSocket } from "../hook/useSocket";
import { Button } from "../components/Button";
import { ChessBoard } from "../components/ChessBoard";
import { Chess } from "chess.js";
import { INIT_GAME } from "./Game";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const GameLanding = () => {
    const [chess, setChess] = useState(new Chess())
    const [board, setBoard] = useState(chess.board());
    const [started, setStarted] = useState(false)
    const [user, setUser] = useState<any | null>(null);
    const [socket, setSocket] = useState<WebSocket | undefined>(undefined);
    
    const router = useNavigate();
    
    useEffect(() => {
        async function validateToken() {
            const res = await axios.get("http://localhost:4000/auth/validate");
            setUser(res.data.user);
            
            if (res.status === 401) {
                router("/signup")
            }
            const s = useSocket();
            if (s === null) return
            if (s === undefined) return
            setSocket(s);
        }
        validateToken();
    }, [])


    return (
        <div className="flex justify-center">
            <div className="pt-8 max-w-screen-lg w-full">
                <div className="grid grid-cols-6 gap-4 md:grid-cols-2  w-full">

                    <div className="cols-span-4 w-full flex justify-center">
                        {socket ? (
                            <ChessBoard board={board} socket={socket} setBoard={setBoard} chess={chess} />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                Connecting...
                            </div>
                        )}
                    </div>
                    <div className="cols-span-2 bg-black/20 w-full flex justify-center">
                        <div className="pt-10">
                            {!started && <Button onClick={() => {
                                socket?.send(JSON.stringify({
                                    type: INIT_GAME,
                                }))
                            }} >Play</Button>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

