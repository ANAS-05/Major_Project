import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import {
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  type User,
  type AuthError,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getStoredUser,
  isAuthenticated as checkIsAuthenticated,
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
  error: string | null;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
  }) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function getErrorMessage(error: AuthError): string {
  switch (error.code) {
    case "auth/invalid-email":
      return "Invalid email address.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/user-not-found":
      return "No account found with this email.";
    case "auth/wrong-password":
      return "Incorrect password.";
    case "auth/invalid-credential":
      return "Invalid email or password.";
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    case "auth/popup-closed-by-user":
      return "Login cancelled.";
    default:
      return error.message || "An error occurred. Please try again.";
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(getStoredUser());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

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

  const clearError = () => setError(null);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      const result = await apiLogin({ email, password });
      setAuthUser(result.user);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
      throw err;
    }
  }, []);

  const register = useCallback(
    async (data: {
      email: string;
      password: string;
      first_name: string;
      last_name: string;
      phone?: string;
    }) => {
      try {
        setError(null);
        const result = await apiRegister(data);
        setAuthUser(result.user);
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Registration failed";
        setError(message);
        throw err;
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch {}
    apiLogout();
    setAuthUser(null);
  }, []);

  const loginWithGoogle = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError(getErrorMessage(err as AuthError));
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      setError(getErrorMessage(err as AuthError));
      throw err;
    }
  };

  const isAuth = checkIsAuthenticated();

  return (
    <AuthContext.Provider
      value={{
        user,
        authUser,
        loading,
        isAuthenticated: isAuth,
        error,
        login,
        register,
        logout,
        loginWithGoogle,
        resetPassword,
        clearError,
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
