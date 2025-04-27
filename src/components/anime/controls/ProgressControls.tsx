
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimeListItem } from "@/services/supabase-service";
import { AnimeMedia } from "@/types/anime";
import { toast } from "@/hooks/use-toast";
import { updateAnimeInList } from "@/services/supabase-service";

interface ProgressControlsProps {
  anime: AnimeMedia;
  inUserList: AnimeListItem;
  onListUpdate: (item: AnimeListItem) => void;
}

export function ProgressControls({ anime, inUserList, onListUpdate }: ProgressControlsProps) {
  const [editingProgress, setEditingProgress] = useState(false);
  const [progress, setProgress] = useState(inUserList.progress);

  const updateProgress = async (newProgress: number) => {
    try {
      if (newProgress >= 0 && (!anime.episodes || newProgress <= anime.episodes)) {
        const result = await updateAnimeInList(inUserList.id, { progress: newProgress });
        if (result && result[0]) {
          onListUpdate(result[0]);
          toast("Progresso aggiornato", {
            description: `Progresso aggiornato a ${newProgress} episodi`
          });
        }
      }
    } catch (error) {
      console.error("Errore nell'aggiornamento del progresso:", error);
      toast("Errore", {
        description: "Impossibile aggiornare il progresso",
        variant: "destructive"
      });
    }
  };

  return (
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
  );
}
