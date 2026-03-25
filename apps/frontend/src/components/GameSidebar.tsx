import { Album, Crown } from "lucide-react"
import { useNavigate } from "react-router-dom"

export const GameSidebar = () => {
    const navigate = useNavigate()
    return <div className="w-1/9 p-4 bg-white/10 rounded-lg h-screen w-0 mr-30">
        <div className=" flex items-center gap-2 relative text-xl font-bold text-white justify-center hover:text-white/80 transition-colors duration-200 cursor-pointer" onClick={() => navigate('/')}>
            <Crown className="w-6 h-6" />
            Chess Master
        </div>

        <div className="text-white/80 font-semibold flex items-center mx-5 my-10 hover:text-white/60 cursor-pointer duration-200">
            <span className="flex items-center gap-2 text-xl">
                <Album className="w-6 h-6 text-green-400 "/>
                Rules
            </span>
        </div>
    </div>
}