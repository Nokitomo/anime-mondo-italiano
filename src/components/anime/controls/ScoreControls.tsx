
import { Button } from "@/components/ui/button";
import { AnimeListItem } from "@/services/supabase-service";
import { useToast } from "@/hooks/use-toast";
import { updateAnimeInList } from "@/services/supabase-service";

interface ScoreControlsProps {
  inUserList: AnimeListItem;
  onListUpdate: (item: AnimeListItem) => void;
}

export function ScoreControls({ inUserList, onListUpdate }: ScoreControlsProps) {
  const { toast } = useToast();

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

  return (
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
  );
}
