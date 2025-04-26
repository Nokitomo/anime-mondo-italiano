
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserX } from "lucide-react";

export function DeleteAccountDialog() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    try {
      setIsLoading(true);

      const { error } = await supabase.auth.admin.deleteUser(
        (await supabase.auth.getUser()).data.user?.id ?? ""
      );

      if (error) throw error;

      toast({
        title: "Account eliminato",
        description: "Il tuo account è stato eliminato con successo.",
      });

      navigate("/");
    } catch (error) {
      console.error("Errore durante l'eliminazione dell'account:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'eliminazione dell'account. Riprova più tardi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          <UserX className="mr-2 h-4 w-4" />
          Elimina Account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sei sicuro di voler eliminare il tuo account?</AlertDialogTitle>
          <AlertDialogDescription>
            Questa azione è irreversibile. Tutti i tuoi dati verranno eliminati permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annulla</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteAccount}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? "Eliminazione..." : "Elimina Account"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
