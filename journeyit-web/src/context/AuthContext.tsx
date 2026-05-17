import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getStoredUser,
  isAuthenticated,
  refreshAccessToken,
  type AuthResponse,
} from "@/lib/api";

interface AuthUser {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  email_verified: boolean;
  is_active: boolean;
  created_at: string | null;
}

interface AuthContextType {
  user: User | null;
  authUser: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
  }) => Promise<AuthResponse>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(getStoredUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    // Try refreshing JWT token on mount if we have one
    const token = localStorage.getItem("refresh_token");
    if (token) {
      refreshAccessToken()
        .then(() => {
          const stored = getStoredUser();
          if (stored) setAuthUser(stored);
        })
        .catch(() => {
          apiLogout();
          setAuthUser(null);
        });
    }

    return unsub;
  }, []);

  const handleLogin = useCallback(async (email: string, password: string) => {
    const result = await apiLogin({ email, password });
    setAuthUser(result.user);
    return result;
  }, []);

  const handleRegister = useCallback(
    async (data: {
      email: string;
      password: string;
      first_name: string;
      last_name: string;
      phone?: string;
    }) => {
      const result = await apiRegister(data);
      setAuthUser(result.user);
      return result;
    },
    []
  );

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch {
      // Firebase signout may fail if not initialized
    }
    apiLogout();
    setAuthUser(null);
  }, []);

  const isAuth = isAuthenticated();

  return (
    <AuthContext.Provider
      value={{
        user,
        authUser,
        loading,
        isAuthenticated: isAuth,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}