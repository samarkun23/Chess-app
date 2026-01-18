import { useNavigate } from "react-router-dom"
import { Button } from "../components/Button";
import { Topbar } from "../components/Topbar";
import { Sword } from "lucide-react";

export const Landing = () => {

    const navigate = useNavigate();

    return <div className="h-screen flex flex-col">

        <Topbar />

        <div className="flex justify-center bg-black/70 flex-1">
            <div className="pt-10">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex justify-center">
                        <img src={"/chessBoard1.jpeg"} alt="" className="max-w-100" />
                    </div>

                    <div className="pt-16">
                        <div className="flex justify-center">
                            <h1 className="text-4xl font-bold text-white">
                                Play chess online!
                            </h1>
                        </div>

                        <div className="flex justify-center">
                            <div className="mt-4">
                                <Button onClick={() => { navigate("/game") }} className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200"  >
                                    <Sword className="w-4 h-4" />
                                    Play online
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

}