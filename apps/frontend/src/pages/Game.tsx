import { useEffect, useState, type JSX } from "react";
import { Chess } from "chess.js";
import { Crown, Users, Clock, Trophy, RotateCcw, Flag, ChevronRight } from "lucide-react";
import { ChessBoard } from "../components/ChessBoard";
import { useSocket } from "../hook/useSocket";
import { GameOver } from "../components/Gameover";
import { GameSidebar } from "../components/GameSidebar";
 
export const INIT_GAME = "init_game";
export const MOVE      = "move";
export const GAME_OVER = "game_over";
 
interface Metadata { blackPlayer: string; whitePlayer: string }
export interface GameOverMetadata { winner: string }
 
/* ── Player card ── */
interface PlayerCardProps {
  name: string;
  color: "white" | "black";
  active: boolean;
}
 
function PlayerCard({ name, color, active }: PlayerCardProps) {
  return (
    <div className={`flex items-center gap-3 rounded-xl px-4 py-2.5 border transition-all duration-200 ${
      active
        ? "bg-green-400/[0.04] border-green-400/35"
        : "bg-white/[0.025] border-white/[0.07]"
    }`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border-2 ${
        color === "white"
          ? "bg-slate-100 border-slate-300"
          : "bg-slate-800 border-slate-700"
      } ${active ? "border-green-400" : ""}`}>
        <Crown size={14} className={color === "white" ? "text-green-950" : "text-green-400"} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-white truncate">
          {name || (color === "white" ? "White" : "Black")}
        </div>
        <div className="text-xs text-slate-500 capitalize">{color}</div>
      </div>
      {active && (
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
      )}
    </div>
  );
}
 
export const Game = () => {
  const socket = useSocket();
  const [chess]   = useState(new Chess());
  const [board, setBoard]             = useState(chess.board());
  const [started, setStarted]         = useState(false);
  const [gameOver, setGameOver]       = useState(false);
  const [gameOverMeta, setGameOverMeta] = useState<GameOverMetadata | null>(null);
  const [gameMeta, setGameMeta]       = useState<Metadata | null>(null);
  const [moves, setMoves]             = useState<{ from: string; to: string }[]>([]);
  const [playerColor, setPlayerColor] = useState<"white" | "black" | null>(null);
 
  useEffect(() => {
    if (!socket) return;
    const onMsg = (e: MessageEvent) => {
      const msg = JSON.parse(e.data);
      switch (msg.type) {
        case INIT_GAME:
          setBoard(chess.board());
          setStarted(true);
          setGameMeta({ blackPlayer: msg.payload.blackPlayer, whitePlayer: msg.payload.whitePlayer });
          setPlayerColor(msg.payload.color);
          break;
        case MOVE:
          try {
            const r = chess.move(msg.payload);
            if (r) { setBoard(chess.board()); setMoves(p => [...p, msg.payload]); }
          } catch { setBoard(chess.board()); }
          break;
        case GAME_OVER:
          setGameOver(true);
          setGameOverMeta({ winner: msg.payload.winner });
          break;
      }
    };
    socket.addEventListener("message", onMsg);
    return () => socket.removeEventListener("message", onMsg);
  }, [socket, chess]);
 
  if (!socket) return (
    <div className="min-h-screen bg-[#080C10] flex items-center justify-center gap-3">
      <div className="w-5 h-5 rounded-full border-2 border-green-400/20 border-t-green-400 animate-spin" />
      <span className="text-slate-500 text-sm">Connecting to server…</span>
    </div>
  );
 
  const turn = chess.turn() === "w" ? "white" : "black";
 
  return (
    <div className="min-h-screen bg-[#080C10] text-slate-200 font-sans flex flex-col">
 
      {gameOver && <GameOver winner={gameOverMeta?.winner!} />}
 
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-3.5 border-b border-white/[0.06] bg-[#080C10]/90 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Crown size={18} className="text-green-400" />
          <span className="text-sm font-bold text-white tracking-tight">ChessMaster</span>
        </div>
 
        {started && gameMeta && (
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-200">{gameMeta.whitePlayer}</span>
            <span className="text-[10px] font-bold text-green-400 bg-green-400/10 border border-green-400/20 rounded-md px-2 py-0.5 uppercase tracking-widest">
              vs
            </span>
            <span className="text-sm font-semibold text-slate-200">{gameMeta.blackPlayer}</span>
          </div>
        )}
 
        <div className="flex gap-2">
          {started && (
            <>
              <button
                title="Offer draw"
                className="flex items-center p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-slate-200 transition-all"
              >
                <RotateCcw size={15} />
              </button>
              <button
                title="Resign"
                className="flex items-center p-2 rounded-lg bg-red-400/10 hover:bg-red-400/20 border border-red-400/20 text-red-400 transition-all"
              >
                <Flag size={15} />
              </button>
            </>
          )}
        </div>
      </header>
 
      {/* ── MAIN ── */}
      <main className="flex-1 flex justify-center gap-10 px-6 md:px-8 py-7 max-w-[1400px] mx-auto w-full items-start">
 
        {/* Board column */}
        <div className="flex flex-col justify-center gap-3 shrink-0">
          <PlayerCard
            name={playerColor === "white" ? (gameMeta?.blackPlayer ?? "Opponent") : (gameMeta?.whitePlayer ?? "Opponent")}
            color={playerColor === "white" ? "black" : "white"}
            active={started && turn === (playerColor === "white" ? "black" : "white")}
          />
          <div className="rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.06)]">
            <ChessBoard board={board} socket={socket} setBoard={setBoard} chess={chess} playerColor={playerColor} />
          </div>
          <PlayerCard
            name={playerColor === "white" ? (gameMeta?.whitePlayer ?? "You") : (gameMeta?.blackPlayer ?? "You")}
            color={playerColor === "white" ? "white" : "black"}
            active={started && turn === playerColor}
          />
        </div>
 
        {/* Side panel */}
        <div className="flex flex-col gap-4 flex-1 min-w-0 max-w-[280px]">
 
          {/* Play button */}
          {!started && (
            <button
              onClick={() => socket.readyState === WebSocket.OPEN && socket.send(JSON.stringify({ type: INIT_GAME }))}
              className="flex items-center justify-center gap-2 w-full bg-green-400 hover:bg-green-500 active:scale-95 text-green-950 font-bold rounded-xl py-4 text-sm transition-all duration-200"
            >
              <Users size={17} />
              Find opponent
              <ChevronRight size={15} />
            </button>
          )}
 
          {/* Turn badge */}
          {started && (
            <div className="flex items-center gap-2.5 bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3">
              <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${turn === "white" ? "bg-slate-100" : "bg-slate-700"}`} />
              <span className="text-xs text-slate-400">
                {(turn === "white" ? gameMeta?.whitePlayer : gameMeta?.blackPlayer) ?? (turn === "white" ? "White" : "Black")}'s turn
              </span>
            </div>
          )}
 
          {/* Move history */}
          <div className="bg-white/[0.025] border border-white/[0.07] rounded-xl overflow-hidden flex flex-col flex-1">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] text-sm font-semibold text-slate-200">
              <Clock size={14} className="text-green-400" />
              <span>Move history</span>
              <span className="ml-auto text-[11px] font-semibold bg-green-400/10 text-green-400 border border-green-400/20 rounded-md px-2 py-0.5">
                {moves.length}
              </span>
            </div>
 
            <div className="overflow-y-auto max-h-80 py-1">
              {moves.length === 0 ? (
                <p className="text-center text-xs text-slate-600 py-6">No moves yet.</p>
              ) : (
                (() => {
                  const rows: JSX.Element[] = [];
                  for (let i = 0; i < moves.length; i += 2) {
                    const w = moves[i], b = moves[i + 1];
                    rows.push(
                      <div
                        key={i}
                        className={`grid grid-cols-[28px_1fr_1fr] gap-1 px-4 py-1.5 text-xs rounded ${i % 4 === 0 ? "bg-white/[0.02]" : ""}`}
                      >
                        <span className="text-slate-600 font-mono">{i / 2 + 1}.</span>
                        <span className="text-slate-200 font-mono font-medium">{w ? `${w.from}→${w.to}` : ""}</span>
                        <span className="text-slate-500 font-mono">{b ? `${b.from}→${b.to}` : ""}</span>
                      </div>
                    );
                  }
                  return rows;
                })()
              )}
            </div>
          </div>
 
          {/* Stats */}
          <div className="bg-white/[0.025] border border-white/[0.07] rounded-xl p-4 flex flex-col gap-3">
            {[
              { icon: <Trophy size={13} className="text-green-400" />, label: "Status", val: gameOver ? "Game over" : started ? "In progress" : "Waiting" },
              { icon: <Users  size={13} className="text-green-400" />, label: "Moves",  val: String(moves.length) },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  {s.icon} {s.label}
                </div>
                <span className="text-sm font-semibold text-white">{s.val}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
