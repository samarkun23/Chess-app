import { useNavigate } from "react-router-dom";
import { Crown, Trophy, RotateCcw, Home, Star } from "lucide-react";
import type { GameOverMetadata } from "../pages/Game";
 
const CONFETTI_COLORS = [
  "bg-green-400", "bg-yellow-400", "bg-blue-400",
  "bg-purple-400", "bg-red-400", "bg-emerald-400",
];
 
export const GameOver = ({ winner }: GameOverMetadata) => {
  const navigate  = useNavigate();
  const isDraw    = !winner;
  const isWin     = !!winner;
 
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
 
      {/* ── Backdrop ── */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
 
      {/* ── Confetti dots (decorative) ── */}
      {isWin && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 rounded-full opacity-70 ${CONFETTI_COLORS[i % CONFETTI_COLORS.length]}`}
              style={{
                left:   `${Math.random() * 100}%`,
                top:    `${Math.random() * 100}%`,
                transform: `scale(${0.5 + Math.random()})`,
                animation: `fall ${2 + Math.random() * 2}s ease-in ${Math.random() * 1}s infinite`,
              }}
            />
          ))}
        </div>
      )}
 
      {/* ── Modal card ── */}
      <div className="relative z-10 w-full max-w-md bg-[#0D1117] border border-white/[0.09] rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.05)] overflow-hidden">
 
        {/* Top accent bar */}
        <div className={`h-1 w-full ${isDraw ? "bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500" : "bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400"}`} />
 
        {/* Glow behind icon */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 blur-3xl pointer-events-none ${isDraw ? "bg-purple-500/15" : "bg-green-400/15"}`} aria-hidden="true" />
 
        <div className="relative px-8 pt-10 pb-8 flex flex-col items-center text-center gap-5">
 
          {/* ── Icon ── */}
          <div className={`relative w-20 h-20 rounded-2xl flex items-center justify-center border ${
            isDraw
              ? "bg-purple-400/10 border-purple-400/25"
              : "bg-green-400/10 border-green-400/25"
          }`}>
            {isDraw
              ? <Star  size={36} className="text-purple-400" />
              : <Trophy size={36} className="text-green-400" />
            }
            {/* Ping ring */}
            {isWin && (
              <span className="absolute inset-0 rounded-2xl border-2 border-green-400/30 animate-ping" />
            )}
          </div>
 
          {/* ── Game Over label ── */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-[0.2em] mb-2">
              Game Over
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-white">
              {isDraw
                ? "It's a Draw!"
                : (
                  <>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                      {winner}
                    </span>{" "}
                    wins!
                  </>
                )
              }
            </h2>
          </div>
 
          {/* ── Winner chip ── */}
          {isWin && (
            <div className="flex items-center gap-2 bg-green-400/10 border border-green-400/20 rounded-full px-5 py-2">
              <Crown size={15} className="text-green-400" />
              <span className="text-green-400 text-sm font-semibold">{winner}</span>
              <span className="text-green-400/50 text-xs">· Champion</span>
            </div>
          )}
 
          {isDraw && (
            <div className="flex items-center gap-2 bg-purple-400/10 border border-purple-400/20 rounded-full px-5 py-2">
              <Star size={15} className="text-purple-400" />
              <span className="text-purple-400 text-sm font-semibold">Both players played brilliantly</span>
            </div>
          )}
 
          {/* ── Divider ── */}
          <div className="w-full h-px bg-white/[0.06]" />
 
          {/* ── Quote ── */}
          <p className="text-slate-500 text-sm leading-relaxed max-w-xs italic">
            {isDraw
              ? '"A draw is a result in which both players demonstrate mastery."'
              : '"Every defeat is a lesson. Every victory is a confirmation of hard work."'
            }
          </p>
 
          {/* ── CTA buttons ── */}
          <div className="flex flex-col sm:flex-row gap-3 w-full mt-1">
            <button
              onClick={() => { navigate("/game"); window.location.reload(); }}
              className="flex-1 flex items-center justify-center gap-2 bg-green-400 hover:bg-green-500 active:scale-95 text-green-950 font-bold rounded-xl py-3.5 text-sm transition-all duration-200 shadow-[0_0_20px_rgba(74,222,128,0.2)]"
            >
              <RotateCcw size={15} />
              Play again
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white font-semibold rounded-xl py-3.5 text-sm transition-all duration-200"
            >
              <Home size={15} />
              Home
            </button>
          </div>
 
          {/* ── Small note ── */}
          <p className="text-slate-600 text-xs">
            Thanks for playing · ChessMaster
          </p>
        </div>
      </div>
 
      <style>{`
        @keyframes fall {
          0%   { transform: translateY(-20px) rotate(0deg);   opacity: 0.8; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0;   }
        }
      `}</style>
    </div>
  );
};
