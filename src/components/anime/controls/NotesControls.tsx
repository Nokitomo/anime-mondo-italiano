
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AnimeListItem } from "@/services/supabase-service";
import { toast } from "@/hooks/use-toast";
import { updateAnimeInList } from "@/services/supabase-service";

interface NotesControlsProps {
  inUserList: AnimeListItem;
  onListUpdate: (item: AnimeListItem) => void;
}

export function NotesControls({ inUserList, onListUpdate }: NotesControlsProps) {
  const [notes, setNotes] = useState(inUserList.notes || "");
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  const saveNotes = async () => {
    try {
      const result = await updateAnimeInList(inUserList.id, { notes });
      if (result && result[0]) {
        onListUpdate(result[0]);
        setIsEditingNotes(false);
        toast("Note aggiornate", {
          description: "Le note sono state salvate con successo"
        });
      }
    } catch (error) {
      console.error("Errore nell'aggiornamento delle note:", error);
      toast("Errore", {
        description: "Impossibile aggiornare le note",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-2">
      <span>Note:</span>
      {isEditingNotes ? (
        <div className="space-y-2">
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[100px]"
            placeholder="Scrivi le tue note qui..."
          />
          <div className="flex gap-2">
            <Button onClick={saveNotes}>Salva</Button>
            <Button variant="outline" onClick={() => {
              setNotes(inUserList.notes || "");
              setIsEditingNotes(false);
            }}>
              Annulla
            </Button>
          </div>
        </div>
      ) : (
        <div>
          {notes ? (
            <p className="whitespace-pre-line bg-muted/20 p-4 rounded-md">{notes}</p>
          ) : (
            <p className="text-muted-foreground italic">Nessuna nota</p>
          )}
          <Button variant="outline" className="mt-2" onClick={() => setIsEditingNotes(true)}>
            Modifica note
          </Button>
        </div>
      )}
    </div>
  );
}
