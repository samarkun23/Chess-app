import { Topbar } from "../components/Topbar"
import { useState } from 'react';
import { Crown, ArrowRight, AlertCircle } from 'lucide-react';
import { useNavigate } from "react-router-dom";


interface SignupPageProps {
    onSwitchToSignIn?: () => void;
}

export const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            setSuccess(true);
            setEmail('');
            setPassword('');
            setConfirmPassword('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const navigate = useNavigate();

    return (
        <div className="h-screen flex flex-col">
            <Topbar />
            <div className=" flex-1 flex justify-center bg-gradient-to-br from-black/80 via-black/60 to-black/80  items-center px-4">
                <div className="w-full max-w-md">
                    <div className="bg-transparent rounded-lg shadow-xl p-8 border border-slate-600">
                        <div className="flex items-center justify-center gap-3 mb-8">
                            <Crown className="w-8 h-8 text-green-500" />
                            <h1 className="text-3xl font-bold text-white">ChessMaster</h1>
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-2 text-center">Create Account</h2>
                        <p className="text-slate-400 text-center mb-8">Join the chess community and start playing</p>

                        {success && (
                            <div className="mb-6 p-4 bg-green-900 border border-green-700 rounded-lg">
                                <p className="text-green-200 text-sm">
                                    Account created! Check your email to confirm your account.
                                </p>
                            </div>
                        )}

                        {error && (
                            <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg flex items-gap-2">
                                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mr-2" />
                                <p className="text-red-200 text-sm">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-green-200 focus:ring-1 focus:ring-green-200 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Username
                                </label>
                                <input
                                    type="email"
                                    // value={""}
                                    // onChange={(e) => setEmail(e.target.value)}
                                    placeholder="username"
                                    required
                                    className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-green-200 focus:ring-1 focus:ring-green-200 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-green-200 focus:ring-1 focus:ring-green-200 transition-colors"
                                />
                            </div>


                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-6 px-4 py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-700 disabled:opacity-50 text-slate-900 font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                                {!loading && <ArrowRight className="w-4 h-4" />}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-slate-400">
                                Already have an account?{' '}
                                <button
                                    className="text-green-100 hover:text-green-200 font-semibold transition-colors"
                                    onClick={() => navigate("/signin")}
                                >
                                    Sign In
                                </button>
                            </p>
                        </div>
                    </div>

                    <p className="text-slate-500 text-xs text-center mt-6">
                        By signing up, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    )
}