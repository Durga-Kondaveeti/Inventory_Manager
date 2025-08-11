// src/pages/Login.tsx
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Invalid credentials. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#FDFBF7] p-6 selection:bg-orange-200 selection:text-orange-900">
      
      {/* Main Card Container with Animation */}
      <div className="animate-fade-in-up w-full max-w-sm">
        
        {/* Header Section */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black tracking-tighter text-stone-900 sm:text-5xl">
            Stock Manager
          </h1>
          <p className="mt-3 text-stone-500 font-medium">
            Welcome back, please identify yourself.
          </p>
        </div>

        {/* Form Card */}
        <div className="animate-fade-in-up animation-delay-200 overflow-hidden rounded-3xl bg-white p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,1)] ring-1 ring-stone-10">
          
          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-600">
              <span className="block h-2 w-2 rounded-full bg-red-600 animate-pulse"></span>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            
            {/* Email Field */}
            <div className="group">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-700 transition-colors group-focus-within:text-orange-600">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="admin@company.com"
                className="w-full rounded-xl bg-stone-50 px-4 py-3.5 text-stone-900 font-bold placeholder-stone-300 outline-none transition-all duration-300 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:shadow-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Field */}
            <div className="group">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-700 transition-colors group-focus-within:text-orange-600">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full rounded-xl bg-stone-50 px-4 py-3.5 text-stone-900 font-bold placeholder-stone-300 outline-none transition-all duration-300 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:shadow-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full transform rounded-2xl bg-stone-900 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all duration-300 hover:scale-[1.02] hover:bg-black hover:shadow-xl active:scale-95 disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Processing
                </span>
              ) : (
                "Secure Login"
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-s font-semibold text-stone-400">
          SDM Glass & Rubber Industries
        </p>
      </div>
    </div>
  );
}