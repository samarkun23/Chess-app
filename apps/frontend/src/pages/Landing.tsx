import { useNavigate } from "react-router-dom";
import { Topbar } from "../components/Topbar";
import { Crown, Sword, Users, Trophy, ChevronRight, Zap, Shield, Star, ArrowRight } from "lucide-react";
 
// 8x8 chess pattern for background texture
const BOARD_CELLS = Array.from({ length: 64 }, (_, i) => (Math.floor(i / 8) + i) % 2 === 0);
 
const STATS = [
  { val: "12K+", label: "Active players", color: "text-green-400"  },
  { val: "4M+",  label: "Games played",   color: "text-blue-400"   },
  { val: "99ms", label: "Avg latency",    color: "text-purple-400" },
  { val: "94%",  label: "Uptime",         color: "text-yellow-400" },
];
 
const FEATURES = [
  {
    icon:  <Zap size={22} className="text-yellow-400" />,
    bg:    "bg-yellow-400/10 border-yellow-400/20",
    title: "Lightning fast",
    desc:  "WebSocket-powered moves with sub-100ms latency. Every move feels instant.",
  },
  {
    icon:  <Shield size={22} className="text-blue-400" />,
    bg:    "bg-blue-400/10 border-blue-400/20",
    title: "Secure & fair",
    desc:  "Anti-cheat detection, server-validated moves, and transparent ELO ratings.",
  },
  {
    icon:  <Trophy size={22} className="text-purple-400" />,
    bg:    "bg-purple-400/10 border-purple-400/20",
    title: "Ranked system",
    desc:  "Climb from beginner to grandmaster. Every game impacts your global rank.",
  },
];
 
const TESTIMONIALS = [
  { name: "Arjun M.",   rating: 1842, quote: "Best online chess experience I've had. The interface is clean and moves are instant." },
  { name: "Sarah K.",   rating: 2104, quote: "Love the ELO matchmaking. Always paired with someone at my level." },
  { name: "Dev P.",     rating: 1560, quote: "Went from 1200 to 1560 in 3 months. The ranked system is super motivating." },
];
 
export const Landing = () => {
  const navigate = useNavigate();
 
  return (
    <div className="min-h-screen bg-[#080C10] text-slate-200 font-sans overflow-x-hidden">
      <Topbar />
 
      {/* ════════════════════════════════
          HERO
      ════════════════════════════════ */}
      <section className="relative flex flex-col lg:flex-row items-center justify-between gap-16 max-w-6xl mx-auto px-6 md:px-10 pt-20 pb-28 min-h-[calc(100vh-64px)]">
 
        {/* ── Background chess grid ── */}
        <div className="absolute inset-0 grid grid-cols-8 pointer-events-none" aria-hidden="true">
          {BOARD_CELLS.map((light, i) => (
            <div key={i} className={`${light ? "bg-white/[0.018]" : ""}`} />
          ))}
        </div>
 
        {/* ── Glow orbs ── */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-green-500/[0.05] blur-[120px] pointer-events-none" aria-hidden="true" />
        <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-purple-500/[0.06] blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-20 left-10 w-56 h-56 rounded-full bg-blue-500/[0.05] blur-3xl pointer-events-none" aria-hidden="true" />
 
        {/* ── Left content ── */}
        <div className="relative z-10 flex-1 max-w-2xl">
 
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 bg-green-400/10 border border-green-400/20 rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-semibold tracking-widest uppercase">
              2,341 players online now
            </span>
          </div>
 
          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.02] text-white mb-6">
            The chess board
            <br />
            <span className="relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400">
                you deserve.
              </span>
              {/* Underline decoration */}
              <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-green-400/60 via-emerald-400/40 to-transparent" />
            </span>
          </h1>
 
          <p className="text-slate-400 text-lg leading-relaxed max-w-lg mb-10">
            Real-time multiplayer chess built for serious players. Sub-100ms moves,
            fair ELO matchmaking, and a clean interface that stays out of your way.
          </p>
 
          {/* CTA buttons */}
          <div className="flex flex-wrap items-center gap-3 mb-14">
            <button
              onClick={() => navigate("/game")}
              className="group flex items-center gap-2.5 bg-green-400 hover:bg-green-500 active:scale-95 text-green-950 font-bold rounded-xl px-7 py-4 text-sm transition-all duration-200 shadow-[0_0_24px_rgba(74,222,128,0.25)]"
            >
              <Sword size={17} />
              Play for free
              <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white font-semibold rounded-xl px-7 py-4 text-sm transition-all duration-200"
            >
              Create account
            </button>
          </div>
 
          {/* Social proof avatars */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {["A", "S", "D", "R", "K"].map((l, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-[#080C10] flex items-center justify-center text-[11px] font-bold"
                  style={{ background: ["#1d4ed8","#7c3aed","#b45309","#065f46","#9f1239"][i], color: "#fff" }}
                >
                  {l}
                </div>
              ))}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-0.5 mb-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={11} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span className="text-xs text-slate-500">Loved by 12,000+ players</span>
            </div>
          </div>
        </div>
 
        {/* ── Right — board image ── */}
        <div className="relative z-10 shrink-0 flex items-center justify-center">
          {/* Glow ring behind image */}
          <div className="absolute w-[420px] h-[420px] rounded-full bg-green-400/[0.07] blur-2xl" aria-hidden="true" />
 
          <div className="relative">
            <img
              src="/bg.png"
              alt="Chess board"
              className="relative z-10 w-[380px] md:w-[420px] rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.06)]"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
 
            {/* Floating cards */}
            <div className="absolute -top-4 -left-12 z-20 flex items-center gap-2.5 bg-[#0F1923]/95 backdrop-blur border border-white/10 rounded-xl px-4 py-2.5 shadow-xl">
              <Trophy size={16} className="text-yellow-400 shrink-0" />
              <div>
                <div className="text-[11px] text-slate-500">Top rating</div>
                <div className="text-sm font-bold text-white">2,847 ELO</div>
              </div>
            </div>
 
            <div className="absolute -bottom-4 -right-10 z-20 flex items-center gap-2.5 bg-[#0F1923]/95 backdrop-blur border border-white/10 rounded-xl px-4 py-2.5 shadow-xl">
              <Users size={16} className="text-green-400 shrink-0" />
              <div>
                <div className="text-[11px] text-slate-500">Online now</div>
                <div className="text-sm font-bold text-white">2,341 <span className="text-green-400">●</span></div>
              </div>
            </div>
 
            <div className="absolute top-1/2 -right-14 -translate-y-1/2 z-20 flex items-center gap-2 bg-[#0F1923]/95 backdrop-blur border border-green-400/20 rounded-xl px-3 py-2 shadow-xl">
              <Zap size={14} className="text-yellow-400 shrink-0" />
              <div className="text-[11px] text-slate-300 font-medium">99ms avg</div>
            </div>
          </div>
        </div>
      </section>
 
      {/* ════════════════════════════════
          STATS BAR
      ════════════════════════════════ */}
      <section className="border-y border-white/[0.06] bg-white/[0.015]">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1 text-center">
              <span className={`text-3xl font-extrabold tracking-tight ${s.color}`}>{s.val}</span>
              <span className="text-xs text-slate-600 uppercase tracking-widest">{s.label}</span>
            </div>
          ))}
        </div>
      </section>
 
      {/* ════════════════════════════════
          FEATURES
      ════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 py-24">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-5">
            <span className="text-xs text-slate-400 font-medium tracking-widest uppercase">Why ChessMaster</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
            Built for players who{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
              take it seriously.
            </span>
          </h2>
          <p className="text-slate-500 text-base max-w-lg mx-auto leading-relaxed">
            Every feature is designed around one goal: giving you the best chess experience possible.
          </p>
        </div>
 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group bg-white/[0.025] hover:bg-white/[0.04] border border-white/[0.07] hover:border-white/[0.14] rounded-2xl p-7 transition-all duration-200 cursor-default"
            >
              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-5 ${f.bg}`}>
                {f.icon}
              </div>
              <h3 className="text-base font-bold text-white mb-2.5">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
 
      {/* ════════════════════════════════
          TESTIMONIALS
      ════════════════════════════════ */}
      <section className="border-t border-white/[0.06] bg-white/[0.01]">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-3">
              What players are saying
            </h2>
            <p className="text-slate-500 text-sm">Real reviews from real players.</p>
          </div>
 
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white/[0.025] border border-white/[0.07] rounded-2xl p-6 flex flex-col gap-4">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-400 leading-relaxed italic">"{t.quote}"</p>
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/[0.06]">
                  <span className="text-sm font-semibold text-white">{t.name}</span>
                  <span className="text-xs font-mono text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded-md">
                    {t.rating} ELO
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      {/* ════════════════════════════════
          CTA BANNER
      ════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-950/60 via-[#0a1a10] to-[#080C10] border border-green-400/15 px-8 md:px-16 py-16 text-center">
          {/* Grid texture */}
          <div className="absolute inset-0 grid grid-cols-8 pointer-events-none opacity-30" aria-hidden="true">
            {BOARD_CELLS.map((light, i) => (
              <div key={i} className={`${light ? "bg-green-400/[0.04]" : ""}`} />
            ))}
          </div>
          {/* Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-green-400/[0.08] blur-3xl pointer-events-none" aria-hidden="true" />
 
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-green-400/10 border border-green-400/20 rounded-full px-4 py-1.5 mb-6">
              <Crown size={13} className="text-green-400" />
              <span className="text-green-400 text-xs font-semibold tracking-widest uppercase">Free to play</span>
            </div>
 
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-5">
              Your next move starts here.
            </h2>
            <p className="text-slate-400 text-base max-w-md mx-auto leading-relaxed mb-10">
              Join 12,000+ players. No credit card needed — just sign up and start playing in seconds.
            </p>
 
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => navigate("/signup")}
                className="group flex items-center gap-2.5 bg-green-400 hover:bg-green-500 active:scale-95 text-green-950 font-bold rounded-xl px-8 py-4 text-sm transition-all duration-200 shadow-[0_0_32px_rgba(74,222,128,0.3)]"
              >
                Get started free
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={() => navigate("/game")}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-semibold rounded-xl px-8 py-4 text-sm transition-all duration-200"
              >
                <Sword size={15} />
                Play as guest
              </button>
            </div>
          </div>
        </div>
      </section>
 
      {/* ════════════════════════════════
          FOOTER
      ════════════════════════════════ */}
      <footer className="border-t border-white/[0.06] px-6 md:px-10 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Crown size={16} className="text-green-400" />
            <span className="text-sm font-bold text-white tracking-tight">ChessMaster</span>
          </div>
          <p className="text-xs text-slate-600">© 2025 ChessMaster. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-slate-600">
            {["Terms", "Privacy", "Contact"].map(l => (
              <a key={l} href="#" className="hover:text-slate-400 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};
