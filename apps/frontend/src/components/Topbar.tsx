import { Crown, Swords, Trophy, User, Settings, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Topbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate = useNavigate();

    return (
        <nav className="bg-gradient-to-r from-black/90 via-black/50 to-black/90 text-white shadow-lg border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3">
                            <Crown className="w-8 h-8 text-green-500" />
                            <span className="text-2xl cursor-pointer font-bold bg-gradient-to-r from-green-400 to-green-200 bg-clip-text text-transparent" onClick={() => { 
                                navigate("/")
                            }}>
                                ChessMaster
                            </span>
                        </div>

                        <div className="hidden md:flex items-center gap-6">
                            <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-black/70 transition-colors duration-200">
                                <Swords className="w-4 h-4" />
                                <span className="font-medium">Play</span>
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-black/70 transition-colors duration-200">
                                <Trophy className="w-4 h-4" />
                                <span className="font-medium">Tournaments</span>
                            </button>
                            <button className="px-4 py-2 rounded-lg hover:bg-black/70 transition-colors duration-200">
                                <span className="font-medium">Learn</span>
                            </button>
                            <button className="px-4 py-2 rounded-lg hover:bg-black/70 transition-colors duration-200">
                                <span className="font-medium">Puzzles</span>
                            </button>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <button className="p-2 rounded-lg hover:bg-black/70 transition-colors duration-200">
                            <Settings className="w-5 h-5" />
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors duration-200 font-semibold text-slate-900" onClick={() => { navigate("/signup") } }>
                            <User className="w-4 h-4" />
                            <span>Sign In</span>
                        </button>
                    </div>

                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-slate-700 transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-slate-700 bg-slate-900">
                    <div className="px-4 py-4 space-y-2">
                        <button className="flex items-center gap-2 w-full px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors duration-200">
                            <Swords className="w-4 h-4" />
                            <span className="font-medium">Play</span>
                        </button>
                        <button className="flex items-center gap-2 w-full px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors duration-200">
                            <Trophy className="w-4 h-4" />
                            <span className="font-medium">Tournaments</span>
                        </button>
                        <button className="w-full px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors duration-200 text-left">
                            <span className="font-medium">Learn</span>
                        </button>
                        <button className="w-full px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors duration-200 text-left">
                            <span className="font-medium">Puzzles</span>
                        </button>
                        <div className="pt-2 border-t border-slate-700 space-y-2">
                            <button className="flex items-center gap-2 w-full px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors duration-200">
                                <Settings className="w-4 h-4" />
                                <span>Settings</span>
                            </button>
                            <button className="flex items-center gap-2 w-full px-4 py-3 bg-amber-500 hover:bg-amber-600 rounded-lg transition-colors duration-200 font-semibold text-slate-900">
                                <User className="w-4 h-4" />
                                <span>Sign In</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}




