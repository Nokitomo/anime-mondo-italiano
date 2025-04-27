import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "../integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type User = {
  id: string;
  email?: string;
  username?: string;
  avatar_url?: string;
};

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
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const setUser = (updates: Partial<User>) => {
    setUserState(prevUser => prevUser ? { ...prevUser, ...updates } : null);
  };

  useEffect(() => {
    // Imposta prima il listener per gli eventi di autenticazione
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          // Usa setTimeout per evitare problemi di deadlock con Supabase
          setTimeout(async () => {
            try {
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('username, avatar_url')
                .eq('id', session.user.id)
                .single();

              if (profileError && profileError.code !== 'PGRST116') {
                console.error("Errore nel recupero del profilo:", profileError);
              }

              setUserState({
                id: session.user.id,
                email: session.user.email,
                username: profileData?.username || undefined,
                avatar_url: profileData?.avatar_url || undefined
              });
              setError(null);
            } catch (error) {
              console.error("Errore nel recupero del profilo:", error);
            } finally {
              setLoading(false);
            }
          }, 0);
        } else if (event === "SIGNED_OUT") {
          setUserState(null);
          setLoading(false);
        }
      }
    );

    // Poi verifica se c'è già una sessione attiva
    const checkUser = async () => {
      try {
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        if (data.session?.user) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', data.session.user.id)
            .single();

          if (profileError && profileError.code !== 'PGRST116') {
            console.error("Errore nel recupero del profilo:", profileError);
          }

          setUserState({
            id: data.session.user.id,
            email: data.session.user.email,
            username: profileData?.username || undefined,
            avatar_url: profileData?.avatar_url || undefined
          });
        }
      } catch (error) {
        console.error("Errore nel controllo dell'utente:", error);
        setError("Errore nel controllo dell'autenticazione.");
      } finally {
        setLoading(false);
      }
    };

    checkUser();
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Errore nel login:", error.message);
        setError(error.message || "Credenziali non valide");
        toast("Errore", {
          description: error.message || "Credenziali non valide",
        });
        return false;
      }
      
      if (!data.user || !data.session) {
        setError("Errore nel recupero dei dati utente");
        return false;
      }
      
      toast("Login effettuato", {
        description: "Benvenuto in AnimeIT!",
      });
      
      return true;
    } catch (error: any) {
      console.error("Eccezione durante il login:", error);
      setError(error.message || "Si è verificato un errore durante il login");
      toast("Errore", {
        description: error.message || "Si è verificato un errore",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, username: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Verifica se esiste già un utente con questa email
      const { data: existingUsers, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .limit(1);
      
      if (checkError) {
        console.error("Errore nella verifica del nome utente:", checkError);
      } else if (existingUsers && existingUsers.length > 0) {
        setError("Nome utente già in uso.");
        toast({
          title: "Errore",
          description: "Nome utente già in uso. Scegli un altro nome utente.",
          variant: "destructive",
        });
        return false;
      }
      
      // Registrazione dell'utente
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        console.error("Errore nella registrazione:", error.message);
        setError(error.message || "Errore durante la registrazione");
        toast({
          title: "Errore",
          description: error.message || "Impossibile completare la registrazione",
          variant: "destructive",
        });
        return false;
      }
      
      if (!data.user) {
        setError("Errore nella creazione dell'utente");
        return false;
      }
      
      // Creazione del profilo utente
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          { id: data.user.id, username, created_at: new Date().toISOString() }
        ]);
      
      if (profileError) {
        console.error("Errore nella creazione del profilo:", profileError.message);
        setError(profileError.message || "Errore nella creazione del profilo");
        
        // Elimina l'utente se il profilo non è stato creato
        await supabase.auth.admin.deleteUser(data.user.id);
        
        toast({
          title: "Errore",
          description: "Errore nella creazione del profilo",
          variant: "destructive",
        });
        return false;
      }
      
      toast({
        title: "Registrazione effettuata",
        description: "Ti abbiamo inviato un'email di conferma. Conferma il tuo account per accedere.",
      });
      
      return true;
    } catch (error: any) {
      console.error("Eccezione durante la registrazione:", error);
      setError(error.message || "Si è verificato un errore durante la registrazione");
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
      setError(null);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Errore nel logout:", error.message);
        setError(error.message || "Errore durante il logout");
        toast({
          title: "Errore",
          description: error.message || "Impossibile effettuare il logout",
          variant: "destructive",
        });
        return false;
      }
      
      setUserState(null);
      
      toast({
        title: "Logout effettuato",
        description: "Hai effettuato il logout con successo",
      });
      return true;
    } catch (error: any) {
      console.error("Eccezione durante il logout:", error);
      setError(error.message || "Si è verificato un errore durante il logout");
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
    throw new Error("useAuth deve essere usato all'interno di un AuthProvider");
  }
  return context;
};
