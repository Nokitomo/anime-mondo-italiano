
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateAnimeInList, AnimeListItem } from "@/services/supabase-service";
import { AnimeMedia } from "@/types/anime";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

interface AnimeListControlsProps {
  anime: AnimeMedia;
  inUserList: AnimeListItem;
  onListUpdate: (item: AnimeListItem | null) => void;
}

export function AnimeListControls({ anime, inUserList, onListUpdate }: AnimeListControlsProps) {
  const { toast } = useToast();
  const [editingProgress, setEditingProgress] = useState(false);
  const [progress, setProgress] = useState(inUserList.progress);
  const [notes, setNotes] = useState(inUserList.notes || "");
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  
  const updateProgress = async (newProgress: number) => {
    try {
      if (newProgress >= 0 && (!anime.episodes || newProgress <= anime.episodes)) {
        const result = await updateAnimeInList(inUserList.id, { progress: newProgress });
        if (result && result[0]) {
          onListUpdate(result[0]);
          toast({
            title: "Progresso aggiornato",
            description: `Progresso aggiornato a ${newProgress} episodi`,
          });
        }
      }
    } catch (error) {
      console.error("Errore nell'aggiornamento del progresso:", error);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare il progresso",
        variant: "destructive",
      });
    }
  };

  const updateStatus = async (newStatus: AnimeListItem["status"]) => {
    try {
      let updates: Partial<AnimeListItem> = { status: newStatus };
      
      // Se lo stato è "COMPLETATO", impostiamo il progresso al numero totale di episodi
      if (newStatus === "COMPLETATO" && anime.episodes) {
        updates.progress = anime.episodes;
      }
      
      const result = await updateAnimeInList(inUserList.id, updates);
      if (result && result[0]) {
        onListUpdate(result[0]);
        toast({
          title: "Stato aggiornato",
          description: `Anime contrassegnato come ${newStatus.toLowerCase()}`,
        });
      }
    } catch (error) {
      console.error("Errore nell'aggiornamento dello stato:", error);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare lo stato",
        variant: "destructive",
      });
    }
  };

  const updateScore = async (newScore: number) => {
    try {
      const result = await updateAnimeInList(inUserList.id, { score: newScore });
      if (result && result[0]) {
        onListUpdate(result[0]);
        toast({
          title: "Voto aggiornato",
          description: `Voto aggiornato a ${newScore}/10`,
        });
      }
    } catch (error) {
      console.error("Errore nell'aggiornamento del voto:", error);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare il voto",
        variant: "destructive",
      });
    }
  };

  const saveNotes = async () => {
    try {
      const result = await updateAnimeInList(inUserList.id, { notes });
      if (result && result[0]) {
        onListUpdate(result[0]);
        setIsEditingNotes(false);
        toast({
          title: "Note aggiornate",
          description: "Le note sono state salvate con successo",
        });
      }
    } catch (error) {
      console.error("Errore nell'aggiornamento delle note:", error);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare le note",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={inUserList.status === "IN_CORSO" ? "default" : "outline"}
          onClick={() => updateStatus("IN_CORSO")}
        >
          In corso
        </Button>
        <Button
          variant={inUserList.status === "COMPLETATO" ? "default" : "outline"}
          onClick={() => updateStatus("COMPLETATO")}
        >
          Completato
        </Button>
        <Button
          variant={inUserList.status === "IN_PAUSA" ? "default" : "outline"}
          onClick={() => updateStatus("IN_PAUSA")}
        >
          In pausa
        </Button>
        <Button
          variant={inUserList.status === "ABBANDONATO" ? "default" : "outline"}
          onClick={() => updateStatus("ABBANDONATO")}
        >
          Abbandonato
        </Button>
        <Button
          variant={inUserList.status === "PIANIFICATO" ? "default" : "outline"}
          onClick={() => updateStatus("PIANIFICATO")}
        >
          Pianificato
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span>Progresso:</span>
          {editingProgress ? (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-20"
                min={0}
                max={anime.episodes || undefined}
              />
              <Button size="sm" onClick={() => {
                updateProgress(progress);
                setEditingProgress(false);
              }}>
                Salva
              </Button>
              <Button size="sm" variant="outline" onClick={() => setEditingProgress(false)}>
                Annulla
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span>{progress}/{anime.episodes || '??'}</span>
              <Button size="sm" variant="outline" onClick={() => setEditingProgress(true)}>
                Modifica
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateProgress(progress + 1)}
                disabled={anime.episodes ? progress >= anime.episodes : false}
              >
                +1
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <span>Voto:</span>
        <div className="flex flex-wrap gap-2">
          {[...Array(10)].map((_, i) => (
            <Button
              key={i + 1}
              variant={inUserList.score === i + 1 ? "default" : "outline"}
              onClick={() => updateScore(i + 1)}
              className="w-10 h-10 p-0"
            >
              {i + 1}
            </Button>
          ))}
        </div>
      </div>

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
    </div>
  );
}
