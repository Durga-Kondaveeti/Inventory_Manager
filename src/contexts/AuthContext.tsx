import { createContext, useContext, useEffect, useState,type ReactNode } from "react";
import { type User, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore"; // Added imports
import { auth, db } from "../lib/firebase";
import { type UserProfile} from "../types";

// 1. Define what data this context provides
interface AuthContextType {
  user: User | null;     // The Firebase user object (or null if logged out)
  profile: UserProfile | null;
  loading: boolean;      
  isAdmin: boolean;
}

// 2. Create the context with default values
const AuthContext = createContext<AuthContextType>(
  { user: null, 
    profile: null,
    loading: true,
    isAdmin: false
});

// 3. Create a helper hook so other pages can easily use this data
export const useAuth = () => useContext(AuthContext);

// 4. The Provider Component (Wraps the whole app)
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for login/logout changes automatically
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // 1. Check if we have a profile for this user in Firestore
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // 2. If yes, load their Role
          setProfile(docSnap.data() as UserProfile);
        } else {
          // 3. If no (First time login), create a default "User" profile
          const newProfile: UserProfile = {
            uid: currentUser.uid,
            email: currentUser.email || "",
            role: 'user' // Default to restricted access
          };
          await setDoc(docRef, newProfile);
          setProfile(newProfile);
        }
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

   return () => unsubscribe();
  }, []);

  const isAdmin = profile?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}