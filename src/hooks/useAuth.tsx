
import { createContext, useContext } from "react";
import { User } from "@supabase/supabase-js";
import { useSession } from "./useSession";
import { useAuthOperations } from "./useAuthOperations";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  setUser: (updates: Partial<User>) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, username: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: sessionLoading, error: sessionError } = useSession();
  const { loading: operationsLoading, error: operationsError, login, register, logout } = useAuthOperations();

  const setUser = (updates: Partial<User>) => {
    if (!user) return;
    // This is handled by useSession now, which will automatically update when the profile changes
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: sessionLoading || operationsLoading,
        error: operationsError || sessionError,
        setUser,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
