
import { Button } from "@/components/ui/button";
import { AnimeMedia } from "@/types/anime";
import { AnimeListItem } from "@/services/supabase-service";
import { statusLabels } from "@/types/anime";

interface AnimeBannerControlsProps {
  anime: AnimeMedia;
  inUserList: AnimeListItem | null;
  onShowListModal: () => void;
  onShowProgressModal: () => void;
  onShowScoreModal: () => void;
}

export function AnimeBannerControls({
  anime,
  inUserList,
  onShowListModal,
  onShowProgressModal,
  onShowScoreModal,
}: AnimeBannerControlsProps) {
  return (
    <div className="mt-6 flex justify-center md:justify-start gap-4">
      <Button
        className="px-4 py-2 bg-primary text-white rounded-md"
        onClick={onShowListModal}
      >
        {inUserList ? statusLabels[inUserList.status] : "Aggiungi alla lista"}
      </Button>
      <Button
        className="px-4 py-2 bg-secondary text-white rounded-md"
        onClick={onShowProgressModal}
      >
        {inUserList
          ? `${inUserList.progress} / ${anime.episodes ?? "?"} EP`
          : `— / ${anime.episodes ?? "?"} EP`}
      </Button>
      <Button
        className="px-4 py-2 bg-secondary text-white rounded-md"
        onClick={onShowScoreModal}
      >
        {inUserList && inUserList.score != null
          ? `${inUserList.score} / 10`
          : "Non votato"}
      </Button>
    </div>
  );
}
