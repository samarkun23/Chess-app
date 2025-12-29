import { useNavigate } from "react-router-dom"

export const Landing = () => {

    const navigate = useNavigate();

    return <div className="flex justify-center">
        <div className="pt-10 max-w-screen-lg">
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
                            <button
                                onClick={() => {
                                    navigate("/game")
                                }}
                                className="bg-green-600 text-white px-6 py-3 text-lg rounded hover:bg-green-800">
                                Play Online
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}