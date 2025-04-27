
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { addAnimeToList, checkAnimeInUserList, AnimeListItem } from "@/services/supabase-service";
import { AnimeMedia, AnimeStatus, statusLabels } from "@/types/anime";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AnimeAddToListProps {
  anime: AnimeMedia;
  inUserList: AnimeListItem | null;
  onListUpdate: (updated: AnimeListItem | null) => void;
}

export const AnimeAddToList = ({ anime, inUserList, onListUpdate }: AnimeAddToListProps) => {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [status, setStatus] = useState<AnimeStatus>(inUserList?.status || "IN_CORSO");
  const [progress, setProgress] = useState(inUserList?.progress.toString() || "0");
  const [score, setScore] = useState(inUserList?.score.toString() || "0");
  const [notes, setNotes] = useState(inUserList?.notes || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddToList = async () => {
    if (!user) {
      toast("Accesso richiesto", {
        description: "Devi accedere per aggiungere anime alla tua lista.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await addAnimeToList(
        anime.id,
        status,
        parseInt(progress) || 0,
        parseInt(score) || 0,
        notes,
        anime.title.userPreferred || anime.title.romaji,
        anime.coverImage.large,
        anime.format
      );
      
      toast(inUserList ? "Aggiornato con successo" : "Aggiunto con successo", {
        description: `${anime.title.userPreferred || anime.title.romaji} è stato ${inUserList ? 'aggiornato nella' : 'aggiunto alla'} tua lista.`
      });
      
      setIsDialogOpen(false);
      try {
        const updated = await checkAnimeInUserList(anime.id);
        onListUpdate(updated);
      } catch (error) {
        console.error("Errore nel controllo anime nella lista dopo l'aggiornamento:", error);
      }
    } catch (error: any) {
      console.error("Errore nell'aggiunta dell'anime alla lista:", error);

      // Messaggio personalizzato per l'errore di tabella mancante
      if (error.message && error.message.includes("anime_list non esiste")) {
        toast("Configurazione richiesta", {
          description: "La tabella anime_list non esiste nel tuo database Supabase. Controlla la console per maggiori informazioni.",
          variant: "destructive"
        });
      } else {
        toast("Errore", {
          description: error.message || "Impossibile aggiungere l'anime alla lista.",
          variant: "destructive"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-anime-primary hover:bg-anime-primary/90">
          <PlusCircle className="mr-2 h-4 w-4" />
          {inUserList ? "Aggiorna nella lista" : "Aggiungi alla lista"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{inUserList ? "Aggiorna nella tua lista" : "Aggiungi alla tua lista"}</DialogTitle>
          <DialogDescription>
            {inUserList ? "Modifica" : "Aggiungi"} "{anime.title.userPreferred || anime.title.romaji}" {inUserList ? "nella" : "alla"} tua lista personale.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="status">Stato</Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as AnimeStatus)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Seleziona uno stato" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(statusLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="progress">Progresso {anime.episodes ? `(max ${anime.episodes})` : ''}</Label>
            <Input
              id="progress"
              type="number"
              min="0"
              max={anime.episodes || undefined}
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="score">Voto (0-10)</Label>
            <Input
              id="score"
              type="number"
              min="0"
              max="10"
              step="0.5"
              value={score}
              onChange={(e) => setScore(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Note</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Aggiungi note personali..."
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setIsDialogOpen(false)}
            disabled={isSubmitting}
          >
            Annulla
          </Button>
          <Button 
            onClick={handleAddToList}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Salvataggio in corso..." : inUserList ? "Aggiorna" : "Aggiungi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
