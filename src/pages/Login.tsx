
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Errore",
        description: "Inserisci email e password",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    // Simuliamo l'accesso (da implementare con Supabase)
    setTimeout(() => {
      toast({
        title: "Info",
        description: "Funzionalità di login non ancora implementata",
      });
      setLoading(false);
    }, 1000);
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
            disabled={loading}
          >
            {loading ? "Accesso in corso..." : "Accedi"}
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
