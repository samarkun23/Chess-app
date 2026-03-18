import { useNavigate } from "react-router-dom"
import { Button } from "../components/Button";
import { Topbar } from "../components/Topbar";
import { Crown, Sword } from "lucide-react";

export const Landing = () => {

    const navigate = useNavigate();

    return <div className="h-screen flex flex-col bg-black">

        <Topbar />

        <div className="flex justify-center bg-black/70 flex-1">
            <div className="pt-16">
                <div className="grid grid-cols-1 gap-16 md:grid-cols-2   ">
                    <div className="pt-16">
                        <div className="flex justify-center ">
                            <h1 className="text-4xl font-bold text-white absolute">
                                <div className=" flex items-center gap-2 relative">
                                    <Crown className="w-6 h-6" />

                                    Chess Master

                                </div>
                                <div className="text-white absolute top-5">
                                    <h4>
                                        __________
                                    </h4>
                                </div>
                            </h1>
                        </div>
                        <div className=" ml-16 max-w-md wrap-break-word whitespace-normal p-4 pl-14 pt-10 text-white relative top-12">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, tenetur, dolores harum beatae maiores dolorem quas, facere natus maxime expedita soluta provident id inventore molestiae corporis veniam quisquam consequuntur quod?
                            Rerum, ab laborum dolorum voluptatum unde velit odio nobis? Quas sunt, incidunt doloremque voluptate distinctio tempora porro nihil fuga ex sapiente quod aliquid labore inventore modi non deleniti itaque amet.
                        </div>

                        <div className="flex justify-center relative top-12">
                            <div className="mt-4">
                                <Button onClick={() => { navigate("/game") }} className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200" >
                                    <Sword className="w-4 h-4" />
                                    Play online
                                </Button>
                            </div>
                        </div>

                    </div>
                    <div className="flex justify-center ">
                        <img src={"/bg.png"} alt="" className="max-w-100" />
                    </div>
                </div>
            </div>
        </div>
    </div>

}