
import { useState, useEffect, createContext, useContext } from "react";
import { supabase, signIn, signUp, signOut } from "../services/supabase-service";
import { useToast } from "@/hooks/use-toast";

type User = {
  id: string;
  email?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, username: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Controlla se l'utente è già autenticato al caricamento
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          setUser({
            id: data.session.user.id,
            email: data.session.user.email,
          });
        }
      } catch (error) {
        console.error("Errore nel controllo dell'utente:", error);
        setError("Errore nel controllo dell'autenticazione.");
      } finally {
        setLoading(false);
      }
    };

    // Ascolta i cambiamenti nell'autenticazione
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
          });
          setError(null);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      }
    );

    checkUser();
    
    // Pulizia dell'ascoltatore quando il componente viene smontato
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const result = await signIn(email, password);
      
      if (!result.success) {
        setError(result.error || "Errore di autenticazione");
        toast({
          title: "Errore",
          description: result.error || "Impossibile effettuare il login",
          variant: "destructive",
        });
        return false;
      }
      
      toast({
        title: "Login effettuato",
        description: "Benvenuto in AnimeIT!",
      });
      setError(null);
      return true;
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Errore",
        description: error.message || "Si è verificato un errore",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, username: string) => {
    try {
      setLoading(true);
      const result = await signUp(email, password, username);
      
      if (!result.success) {
        setError(result.error || "Errore durante la registrazione");
        toast({
          title: "Errore",
          description: result.error || "Impossibile completare la registrazione",
          variant: "destructive",
        });
        return false;
      }
      
      toast({
        title: "Registrazione effettuata",
        description: "Ti abbiamo inviato un'email di conferma. Conferma il tuo account per accedere.",
      });
      setError(null);
      return true;
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Errore",
        description: error.message || "Si è verificato un errore",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const result = await signOut();
      
      if (!result.success) {
        setError(result.error || "Errore durante il logout");
        toast({
          title: "Errore",
          description: result.error || "Impossibile effettuare il logout",
          variant: "destructive",
        });
        return false;
      }
      
      toast({
        title: "Logout effettuato",
        description: "Hai effettuato il logout con successo",
      });
      return true;
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Errore",
        description: error.message || "Si è verificato un errore",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
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
    throw new Error("useAuth deve essere usato all'interno di un AuthProvider");
  }
  return context;
};
