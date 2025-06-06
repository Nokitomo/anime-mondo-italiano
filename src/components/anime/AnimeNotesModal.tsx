
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { AnimeListItem, updateAnimeInList } from "@/services/supabase-service";
import { toast } from "@/hooks/use-toast";

interface AnimeNotesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inUserList: AnimeListItem;
  onUpdate: (item: AnimeListItem) => void;
}

export function AnimeNotesModal({ open, onOpenChange, inUserList, onUpdate }: AnimeNotesModalProps) {
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Reset notes when the modal opens with current notes
  useEffect(() => {
    if (open) {
      setNotes(inUserList.notes || "");
    }
  }, [open, inUserList.notes]);
  
  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      const [result] = await updateAnimeInList(inUserList.id, { notes });
      if (result) {
        // Update notes state in parent component
        onUpdate(result);
        toast({
          title: "Note aggiornate",
          description: "Le note sono state salvate con successo"
        });
        // Close modal only after successful update
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
  
  const handleCancel = () => {
    if (isSubmitting) return;
    
    // Reset notes and close modal
    setNotes(inUserList.notes || "");
    onOpenChange(false);
  };
  
  return (
    <Dialog 
      open={open} 
      onOpenChange={(isOpen) => {
        if (!isSubmitting) {
          onOpenChange(isOpen);
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modifica note</DialogTitle>
          <DialogDescription>
            Scrivi qui le tue considerazioni e annotazioni personali su questo anime.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Scrivi le tue note qui..."
            className="min-h-[150px]"
            disabled={isSubmitting}
          />
          
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
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
