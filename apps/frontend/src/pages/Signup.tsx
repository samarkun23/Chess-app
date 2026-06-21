import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Topbar } from "../components/Topbar";
import { Crown, ArrowRight, AlertCircle, Eye, EyeOff, Mail, User, Lock } from "lucide-react";
import axios from "axios";
 
const api = axios.create({ baseURL: "http://localhost:4000/auth", withCredentials: true });
 
const MINI_BOARD = Array.from({ length: 25 }, (_, i) => (Math.floor(i / 5) + i) % 2 === 0);
 
interface FieldProps {
  label: string;
  icon: React.ReactNode;
  trailing?: React.ReactNode;
  children: React.ReactNode;
}
 
function Field({ label, icon, trailing, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-400">{label}</label>
      <div className="relative flex items-center">
        <span className="absolute left-3 text-slate-500 pointer-events-none flex">{icon}</span>
        {children}
        {trailing}
      </div>
    </div>
  );
}
 
export function SignUp() {
  const [email, setEmail]       = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const navigate = useNavigate();
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true); setError("");
    try {
      await api.post("/signup", { email, username, password });
      navigate("/signin");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="min-h-screen flex flex-col bg-[#080C10] text-slate-200 font-sans">
      <Topbar />
 
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2">
 
        {/* ── Left art panel ── */}
        <div className="hidden md:flex flex-col items-center justify-center gap-8 bg-[#0A1018] border-r border-white/[0.06] p-12 relative overflow-hidden">
          {/* Mini chess board */}
          <div className="grid grid-cols-5 gap-0.5 w-48 h-48">
            {MINI_BOARD.map((light, i) => (
              <div key={i} className={`rounded-sm ${light ? "bg-green-400/10" : "bg-white/[0.02]"}`} />
            ))}
          </div>
 
          {/* Glow */}
          <div className="absolute w-80 h-80 rounded-full bg-green-400/[0.06] blur-3xl pointer-events-none" aria-hidden="true" />
 
          {/* Quote */}
          <div className="relative z-10 flex flex-col items-center gap-4 text-center">
            <Crown size={28} className="text-green-400" />
            <p className="text-sm text-slate-500 italic leading-relaxed max-w-[260px]">
              "Chess is not about the next move, but the vision beyond."
            </p>
          </div>
        </div>
 
        {/* ── Right form panel ── */}
        <div className="flex items-center justify-center p-8 md:p-12">
          <div className="w-full max-w-sm">
 
            {/* Brand */}
            <div className="flex items-center gap-2 mb-8">
              <Crown size={20} className="text-green-400" />
              <span className="text-base font-bold text-white tracking-tight">ChessMaster</span>
            </div>
 
            <h1 className="text-2xl font-extrabold text-white tracking-tight mb-2">Create account</h1>
            <p className="text-sm text-slate-500 mb-7 leading-relaxed">
              Join thousands of players competing worldwide.
            </p>
 
            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-400/10 border border-red-400/25 rounded-xl px-4 py-3 mb-5">
                <AlertCircle size={15} className="text-red-400 shrink-0" />
                <span className="text-red-300 text-sm">{error}</span>
              </div>
            )}
 
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Field label="Email" icon={<Mail size={15} />}>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full bg-white/[0.04] border border-white/10 focus:border-green-400/50 focus:bg-green-400/[0.04] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-colors duration-200"
                />
              </Field>
 
              <Field label="Username" icon={<User size={15} />}>
                <input
                  type="text"
                  placeholder="your_handle"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  className="w-full bg-white/[0.04] border border-white/10 focus:border-green-400/50 focus:bg-green-400/[0.04] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-colors duration-200"
                />
              </Field>
 
              <Field
                label="Password"
                icon={<Lock size={15} />}
                trailing={
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    className="absolute right-3 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                }
              >
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full bg-white/[0.04] border border-white/10 focus:border-green-400/50 focus:bg-green-400/[0.04] rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-slate-600 outline-none transition-colors duration-200"
                />
              </Field>
 
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 mt-2 bg-green-400 hover:bg-green-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-green-950 font-bold rounded-xl py-3.5 text-sm transition-all duration-200"
              >
                {loading ? "Creating account…" : "Create account"}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>
 
            <p className="text-center text-sm text-slate-500 mt-6">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/signin")}
                className="text-green-400 hover:text-green-300 font-semibold transition-colors hover:underline"
              >
                Sign in
              </button>
            </p>
 
            <p className="text-center text-xs text-slate-700 mt-5 leading-relaxed">
              By signing up you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
 
