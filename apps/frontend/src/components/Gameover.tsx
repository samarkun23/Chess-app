import { useNavigate } from "react-router-dom"
import type { GameOverMetadata } from "../pages/Game"

export const GameOver = ({ winner }: GameOverMetadata) => {
    const navigate = useNavigate();
    return (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
            <div className="h-96 w-96 bg-white/80 drop-shadow-[0_0_10px_rgba(65,255,1193,0.9)] border border-black/50 rounded-xl p-6 text-center">
                <p className="text-3xl font-bold mt-2 text-black/80">
                    Game Over
                </p>

                <div className="text-black mt-5 text-xl font-semibold">
                        {winner ? `Winner: ${winner}` : "Draw"}
                </div>

                <p className="text-black mt-4 text-lg">
                    Thanks for playing!
                </p>

                <p className="text-black mt-4 text-md">
                    Every defeat is an opportunity to learn from our mistakes! Every victory is a confirmation of our hard work.
                </p>

                <button className="bg-black hover:bg-black/70 duration-200 border-white/40 border-2 text-white mt-5 p-5 font-semibold rounded-4xl" onClick={() => {
                    navigate("/")
                }}>Play Again!</button>
            </div>
        </div>
    )
}