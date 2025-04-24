
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !email || !password) {
      toast({
        title: "Errore",
        description: "Compila tutti i campi richiesti",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Errore",
        description: "Le password non coincidono",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    // Simuliamo la registrazione (da implementare con Supabase)
    setTimeout(() => {
      toast({
        title: "Info",
        description: "Funzionalità di registrazione non ancora implementata",
      });
      setLoading(false);
    }, 1000);
  };
  
  return (
    <div className="container flex items-center justify-center min-h-[80vh] py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Registrati</h1>
          <p className="mt-2 text-muted-foreground">
            Crea un account per iniziare a usare AnimeIT
          </p>
        </div>
        
        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Nome utente</Label>
            <Input
              id="username"
              placeholder="Il tuo nome utente"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reg-email">Email</Label>
            <Input
              id="reg-email"
              type="email"
              placeholder="La tua email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reg-password">Password</Label>
            <Input
              id="reg-password"
              type="password"
              placeholder="Scegli una password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Conferma password</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Conferma la tua password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          <Button
            type="submit"
            className="w-full bg-anime-primary hover:bg-anime-primary/90"
            disabled={loading}
          >
            {loading ? "Registrazione in corso..." : "Registrati"}
          </Button>
        </form>
        
        <div className="mt-4 text-center">
          <p>
            Hai già un account?{" "}
            <Link to="/login" className="text-anime-primary hover:underline">
              Accedi
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
