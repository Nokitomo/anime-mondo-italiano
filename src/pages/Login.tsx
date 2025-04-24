
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!email || !password) {
      toast.error("Inserisci email e password");
      setIsLoading(false);
      return;
    }
    
    try {
      const success = await login(email, password);
      if (success) {
        toast.success("Login effettuato con successo");
        navigate('/');
      }
    } catch (err) {
      console.error("Errore durante il login:", err);
      toast.error("Impossibile effettuare il login. Verifica le credenziali.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container flex items-center justify-center min-h-[80vh] py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Accedi</h1>
          <p className="mt-2 text-muted-foreground">
            Bentornato su AnimeIT!
          </p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="La tua email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link 
                to="/password-dimenticata"
                className="text-sm text-anime-primary hover:underline"
              >
                Password dimenticata?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="La tua password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <Button
            type="submit"
            className="w-full bg-anime-primary hover:bg-anime-primary/90"
            disabled={isLoading || loading}
          >
            {(isLoading || loading) ? "Accesso in corso..." : "Accedi"}
          </Button>
        </form>
        
        <div className="mt-4 text-center">
          <p>
            Non hai un account?{" "}
            <Link to="/registrazione" className="text-anime-primary hover:underline">
              Registrati
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
