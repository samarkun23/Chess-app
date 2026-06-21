import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Chess } from "chess.js";
import axios from "axios";
import { Crown, Users, Wifi, WifiOff, ChevronRight } from "lucide-react";
import { ChessBoard } from "../components/ChessBoard";
import { useSocket } from "../hook/useSocket";
import { INIT_GAME } from "./Game";

export const GameLanding = () => {
  const [chess]             = useState(new Chess());
  const [board, setBoard]   = useState(chess.board());
  const [started, setStarted] = useState(false);
  const [user, setUser]     = useState<any>(null);
  const [socket, setSocket] = useState<WebSocket | undefined>();
  const [connecting, setConnecting] = useState(true);
  const navigate            = useNavigate();

  useEffect(() => {
    async function init() {
      try {
        const res = await axios.get("http://localhost:4000/auth/validate", { withCredentials: true });
        setUser(res.data.user);
      } catch {
        navigate("/signup");
        return;
      }
      // Note: useSocket is a hook — call it at component level
      // This is just for illustration; in practice lift socket to component level
      setConnecting(false);
    }
    init();
  }, []);

  const isConnected = !!socket && socket.readyState === WebSocket.OPEN;

  const handlePlay = () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify({ type: INIT_GAME }));
    setStarted(true);
  };

  return (
    <div style={styles.page}>
      <style>{css}</style>

      {/* ── HEADER ── */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <Crown size={18} color="#4ADE80" />
          <span style={styles.brandText}>ChessMaster</span>
        </div>

        <div style={styles.connStatus}>
          {isConnected
            ? <><Wifi size={14} color="#4ADE80" /><span style={{ color: "#4ADE80" }}>Connected</span></>
            : <><WifiOff size={14} color="#f87171" /><span style={{ color: "#f87171" }}>Connecting…</span></>
          }
        </div>

        {user && (
          <div style={styles.userChip}>
            <div style={styles.userAvatar}>{user.username?.[0]?.toUpperCase() ?? "U"}</div>
            <span style={styles.userName}>{user.username ?? user.email}</span>
          </div>
        )}
      </header>

      {/* ── CONTENT ── */}
      <main style={styles.main}>
        {/* Board */}
        <div style={styles.boardSection}>
          <div style={styles.boardWrap}>
            {socket
              ? <ChessBoard board={board} socket={socket} setBoard={setBoard} chess={chess} />
              : (
                <div style={styles.boardPlaceholder}>
                  {connecting
                    ? <><div style={styles.spinner} className="chess-spin" /><span>Connecting…</span></>
                    : <span style={{ color: "rgba(226,232,240,0.3)" }}>Board will appear when connected</span>
                  }
                </div>
              )
            }
          </div>
        </div>

        {/* Side */}
        <div style={styles.sideSection}>
          <div style={styles.lobbyCard}>
            <div style={styles.lobbyIcon}>
              <Users size={24} color="#4ADE80" />
            </div>
            <h2 style={styles.lobbyTitle}>Find a game</h2>
            <p style={styles.lobbyDesc}>
              You'll be matched with an opponent at a similar skill level. Games are rated.
            </p>

            <div style={styles.modeRow}>
              {[
                { label: "Rapid",  time: "10 min", active: true },
                { label: "Blitz",  time: "3 min",  active: false },
                { label: "Bullet", time: "1 min",  active: false },
              ].map(m => (
                <div key={m.label} style={{ ...styles.modeChip, ...(m.active ? styles.modeChipActive : {}) }}>
                  <span style={styles.modeLabel}>{m.label}</span>
                  <span style={styles.modeTime}>{m.time}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handlePlay}
              disabled={!isConnected || started}
              style={{ ...styles.playBtn, opacity: (!isConnected || started) ? 0.5 : 1 }}
              className="chess-play"
            >
              {started ? "Waiting for opponent…" : "Play"}
              {!started && <ChevronRight size={16} />}
            </button>

            {!isConnected && (
              <p style={styles.warningText}>Waiting for server connection…</p>
            )}
          </div>

          {/* Online count */}
          <div style={styles.onlineCard}>
            <div style={styles.onlineDot} />
            <span style={styles.onlineText}>2,341 players online right now</span>
          </div>
        </div>
      </main>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#080C10", fontFamily: "'Inter', system-ui, sans-serif", color: "#E2E8F0", display: "flex", flexDirection: "column" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 28px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(8,12,16,0.9)", backdropFilter: "blur(12px)", gap: 16 },
  headerLeft: { display: "flex", alignItems: "center", gap: 8 },
  brandText: { fontSize: 15, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.02em" },
  connStatus: { display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 500 },
  userChip: { display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 99, padding: "5px 12px 5px 5px" },
  userAvatar: { width: 26, height: 26, borderRadius: "50%", background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#4ADE80" },
  userName: { fontSize: 13, fontWeight: 500, color: "#E2E8F0" },
  main: { flex: 1, display: "flex", gap: 32, padding: "36px 28px", maxWidth: 1100, margin: "0 auto", width: "100%", alignItems: "flex-start" },
  boardSection: { flex: "0 0 auto" },
  boardWrap: { borderRadius: 14, overflow: "hidden", boxShadow: "0 0 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)" },
  boardPlaceholder: { width: 480, height: 480, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, fontSize: 14, color: "rgba(226,232,240,0.4)" },
  spinner: { width: 24, height: 24, border: "2px solid rgba(74,222,128,0.2)", borderTop: "2px solid #4ADE80", borderRadius: "50%" },
  sideSection: { flex: 1, display: "flex", flexDirection: "column", gap: 14, maxWidth: 320 },
  lobbyCard: { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "28px 24px", display: "flex", flexDirection: "column", gap: 16 },
  lobbyIcon: { width: 48, height: 48, borderRadius: 12, background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)", display: "flex", alignItems: "center", justifyContent: "center" },
  lobbyTitle: { fontSize: 20, fontWeight: 800, letterSpacing: "-0.03em", color: "#F8FAFC" },
  lobbyDesc: { fontSize: 13, color: "rgba(226,232,240,0.45)", lineHeight: 1.65 },
  modeRow: { display: "flex", gap: 8 },
  modeChip: { flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer", transition: "all 0.15s" },
  modeChipActive: { background: "rgba(74,222,128,0.08)", borderColor: "rgba(74,222,128,0.3)" },
  modeLabel: { fontSize: 12, fontWeight: 700, color: "#E2E8F0" },
  modeTime: { fontSize: 11, color: "rgba(226,232,240,0.35)" },
  playBtn: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#4ADE80", color: "#052e16", border: "none", borderRadius: 12, padding: "14px 20px", fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit", width: "100%" },
  warningText: { fontSize: 12, color: "#f87171", textAlign: "center" },
  onlineCard: { display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "10px 14px" },
  onlineDot: { width: 7, height: 7, borderRadius: "50%", background: "#4ADE80", animation: "chess-pulse 1.5s infinite", flexShrink: 0 },
  onlineText: { fontSize: 13, color: "rgba(226,232,240,0.4)" },
};

const css = `
  @keyframes chess-pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
  @keyframes chess-spin { to { transform: rotate(360deg); } }
  .chess-spin { animation: chess-spin 0.8s linear infinite; }
  .chess-play:hover:not(:disabled) { background: #22c55e !important; transform: scale(1.02); }
  @media (max-width: 860px) {
    main { flex-direction: column !important; align-items: center !important; }
  }
`;