// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";

// 1. Define what data this context provides
interface AuthContextType {
  user: User | null;     // The Firebase user object (or null if logged out)
  loading: boolean;      // Are we still checking if they are logged in?
}

// 2. Create the context with default values
const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

// 3. Create a helper hook so other pages can easily use this data
export const useAuth = () => useContext(AuthContext);

// 4. The Provider Component (Wraps the whole app)
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for login/logout changes automatically
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup listener when app closes
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}