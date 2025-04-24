
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUsername?: string;
}

export const EditProfileDialog = ({ open, onOpenChange, currentUsername }: EditProfileDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [username, setUsername] = useState(currentUsername || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      // Aggiorna il profilo
      if (username !== currentUsername) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ username })
          .eq("id", user.id);

        if (profileError) throw profileError;
      }

      // Aggiorna email se modificata
      if (email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({ email });
        if (emailError) throw emailError;
      }

      // Aggiorna password se inserita
      if (password) {
        const { error: passwordError } = await supabase.auth.updateUser({ password });
        if (passwordError) throw passwordError;
      }

      toast({
        title: "Profilo aggiornato",
        description: "Le modifiche sono state salvate con successo",
      });
      
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Errore",
        description: error.message || "Si è verificato un errore durante l'aggiornamento",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifica profilo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="text-sm font-medium">
              Nome utente
            </label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Il tuo nome utente"
            />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="La tua email"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium">
              Nuova password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Lascia vuoto per non modificare"
            />
          </div>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
              Annulla
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvataggio..." : "Salva"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
