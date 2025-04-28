
import { Button } from "@/components/ui/button";
import { AnimeListItem } from "@/services/supabase-service";
import { AnimeMedia } from "@/types/anime";

interface StatusControlsProps {
  anime: AnimeMedia;
  inUserList: AnimeListItem;
  onListUpdate: (item: AnimeListItem) => void;
}

export function StatusControls({ anime, inUserList, onShowListModal }: StatusControlsProps) {
  return (
    <Button
      className="px-4 py-2 bg-primary text-white rounded-md"
      onClick={onShowListModal}
    >
      {inUserList ? statusLabels[inUserList.status] : "Aggiungi alla lista"}
    </Button>
  );
}
