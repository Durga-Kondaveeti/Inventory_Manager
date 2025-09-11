// src/components/Layout.tsx
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useNavigate } from "react-router-dom";
import { type ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans">
      <nav className="sticky top-0 z-50 border-b border-stone-100 bg-white/80 px-6 py-4 backdrop-blur-md ">
        <div className="mx-auto flex max-w-7xl items-center justify-between ">
          
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-900 text-white font-bold">
              S
            </div>
            <span className="text-xl font-black tracking-tighter">
              Stock<span className="text-orange-500">.</span>Manager
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="group relative overflow-hidden rounded-full bg-stone-100 px-5 py-2 text-xs font-bold uppercase tracking-widest text-stone-600 transition-all hover:bg-stone-200 hover:text-stone-900"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl p-6">
        <div className="animate-fade-in-up">
          {children}
        </div>
      </main>
    </div>
  );
}