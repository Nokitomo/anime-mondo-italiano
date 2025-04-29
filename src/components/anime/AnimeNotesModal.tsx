
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { AnimeListItem, updateAnimeInList } from "@/services/supabase-service";
import { toast } from "@/hooks/use-toast";

interface AnimeNotesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inUserList: AnimeListItem;
  onUpdate: (item: AnimeListItem) => void;
}

export function AnimeNotesModal({ open, onOpenChange, inUserList, onUpdate }: AnimeNotesModalProps) {
  const [notes, setNotes] = useState(inUserList.notes || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const [result] = await updateAnimeInList(inUserList.id, { notes });
      if (result) {
        onUpdate(result);
        toast({
          title: "Note aggiornate",
          description: "Le note sono state salvate con successo"
        });
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Errore nell'aggiornamento delle note:", error);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare le note",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modifica note</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Scrivi le tue note qui..."
            className="min-h-[150px]"
          />
          
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annulla
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Salvataggio..." : "Salva note"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
