
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AnimeListItem, updateAnimeInList } from "@/services/supabase-service";
import { AnimeMedia } from "@/types/anime";
import { statusLabels } from "@/types/anime/status";
import { toast } from "@/hooks/use-toast";

interface StatusControlsProps {
  anime: AnimeMedia;
  inUserList: AnimeListItem;
  onListUpdate: (item: AnimeListItem) => void;
}

export function StatusControls({ anime, inUserList, onListUpdate }: StatusControlsProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateStatus = async (newStatus: AnimeListItem["status"]) => {
    try {
      setIsUpdating(true);
      let updates: Partial<AnimeListItem> = { status: newStatus };
      
      if (newStatus === "COMPLETATO" && anime.episodes) {
        updates.progress = anime.episodes;
      }
      
      const result = await updateAnimeInList(inUserList.id, updates);
      if (result && result[0]) {
        onListUpdate(result[0]);
        toast({
          title: "Stato aggiornato",
          description: `Anime contrassegnato come ${statusLabels[newStatus].toLowerCase()}`
        });
      }
    } catch (error) {
      console.error("Errore nell'aggiornamento dello stato:", error);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare lo stato",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={inUserList.status === "IN_CORSO" ? "default" : "outline"}
          onClick={() => updateStatus("IN_CORSO")}
          disabled={isUpdating}
        >
          {statusLabels["IN_CORSO"]}
        </Button>
        <Button
          variant={inUserList.status === "COMPLETATO" ? "default" : "outline"}
          onClick={() => updateStatus("COMPLETATO")}
          disabled={isUpdating}
        >
          {statusLabels["COMPLETATO"]}
        </Button>
        <Button
          variant={inUserList.status === "IN_PAUSA" ? "default" : "outline"}
          onClick={() => updateStatus("IN_PAUSA")}
          disabled={isUpdating}
        >
          {statusLabels["IN_PAUSA"]}
        </Button>
        <Button
          variant={inUserList.status === "ABBANDONATO" ? "default" : "outline"}
          onClick={() => updateStatus("ABBANDONATO")}
          disabled={isUpdating}
        >
          {statusLabels["ABBANDONATO"]}
        </Button>
        <Button
          variant={inUserList.status === "PIANIFICATO" ? "default" : "outline"}
          onClick={() => updateStatus("PIANIFICATO")}
          disabled={isUpdating}
        >
          {statusLabels["PIANIFICATO"]}
        </Button>
      </div>
    </div>
  );
}
