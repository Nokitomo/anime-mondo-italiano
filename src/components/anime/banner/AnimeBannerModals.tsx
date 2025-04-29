
import { AddToListModal } from "../AnimeAddToListModal";
import { ProgressModal } from "../AnimeProgressModal";
import { ScoreModal } from "../AnimeScoreModal";
import { AnimeMedia } from "@/types/anime";
import { AnimeListItem } from "@/services/supabase-service";

interface AnimeBannerModalsProps {
  anime: AnimeMedia;
  inUserList: AnimeListItem | null;
  showListModal: boolean;
  showProgressModal: boolean;
  showScoreModal: boolean;
  setShowListModal: (show: boolean) => void;
  setShowProgressModal: (show: boolean) => void;
  setShowScoreModal: (show: boolean) => void;
  onUpdateItem: (status: AnimeListItem["status"] | null, progress?: number, score?: number) => void;
  setInUserList: (item: AnimeListItem | null) => void;
}

export function AnimeBannerModals({
  anime,
  inUserList,
  showListModal,
  showProgressModal,
  showScoreModal,
  setShowListModal,
  setShowProgressModal,
  setShowScoreModal,
  onUpdateItem,
  setInUserList
}: AnimeBannerModalsProps) {
  return (
    <>
      <AddToListModal
        anime={anime}
        initial={inUserList}
        open={showListModal}
        onClose={() => setShowListModal(false)}
        onUpdate={setInUserList}
      />

      <ProgressModal
        anime={anime}
        initialProgress={inUserList?.progress ?? 0}
        open={showProgressModal}
        onClose={() => setShowProgressModal(false)}
        onUpdate={(newProgress) => {
          onUpdateItem(null, newProgress);
          setInUserList((prev) =>
            prev ? { ...prev, progress: newProgress } : prev
          );
        }}
      />

      <ScoreModal
        anime={anime}
        initialScore={inUserList?.score ?? null}
        open={showScoreModal}
        onClose={() => setShowScoreModal(false)}
        onUpdate={(newScore) => {
          onUpdateItem(null, undefined, newScore);
          setInUserList((prev) =>
            prev ? { ...prev, score: newScore } : prev
          );
        }}
      />
    </>
  );
}
