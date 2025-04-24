
import { Button } from "@/components/ui/button";
import { AnimeListItem } from "@/services/supabase-service";
import { AnimeMedia } from "@/types/anime";
import { useToast } from "@/hooks/use-toast";
import { updateAnimeInList } from "@/services/supabase-service";

interface StatusControlsProps {
  anime: AnimeMedia;
  inUserList: AnimeListItem;
  onListUpdate: (item: AnimeListItem) => void;
}

export function StatusControls({ anime, inUserList, onListUpdate }: StatusControlsProps) {
  const { toast } = useToast();

  const updateStatus = async (newStatus: AnimeListItem["status"]) => {
    try {
      let updates: Partial<AnimeListItem> = { status: newStatus };
      
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

  return (
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
  );
}
