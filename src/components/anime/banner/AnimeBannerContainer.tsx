
import { AnimeMedia } from "@/types/anime";
import { AnimeBannerMedia } from "./AnimeBannerMedia";
import { AnimeBannerContent } from "./AnimeBannerContent";
import { AnimeBannerModals } from "./AnimeBannerModals";
import { AnimeListItem } from "@/services/supabase-service";
import { useEffect } from "react";
import { AnimeRemoveDialog } from "./AnimeRemoveDialog";
import { AnimeNotesModal } from "@/components/anime/AnimeNotesModal";
import { useAnimeListOperations } from "@/hooks/useAnimeListOperations";
import { useNextEpisode } from "@/hooks/useNextEpisode";
import { useAnimeModals } from "@/hooks/useAnimeModals";

interface AnimeBannerContainerProps {
  anime: AnimeMedia;
  onUpdateNotes?: (anime: AnimeListItem) => void;
}

export function AnimeBannerContainer({ anime, onUpdateNotes }: AnimeBannerContainerProps) {
  const {
    inUserList,
    isProcessing,
    refreshListStatus,
    handleUpdateItem,
    handleRemoveAnime,
    handleNoteUpdate
  } = useAnimeListOperations(anime, onUpdateNotes);

  const nextEpisodeFormatted = useNextEpisode(anime);
  
  const {
    showListModal,
    showProgressModal,
    showScoreModal,
    showRemoveDialog,
    showNotesModal,
    setShowListModal,
    setShowProgressModal,
    setShowScoreModal,
    setShowRemoveDialog,
    setShowNotesModal
  } = useAnimeModals();

  useEffect(() => {
    refreshListStatus();
  }, [refreshListStatus]);
  
  const studios = anime.studios?.nodes.map((s) => s.name).join(", ");
  
  return (
    <div className="relative bg-black text-white overflow-hidden">
      <AnimeBannerMedia anime={anime} />
      
      <div className="container relative z-10 py-6 px-4 sm:px-6 md:py-12">
        <AnimeBannerContent 
          anime={anime}
          studios={studios}
          inUserList={inUserList}
          nextEpisodeFormatted={nextEpisodeFormatted}
          onShowListModal={() => !isProcessing && setShowListModal(true)}
          onShowProgressModal={() => !isProcessing && setShowProgressModal(true)}
          onShowScoreModal={() => !isProcessing && setShowScoreModal(true)}
          onShowRemoveDialog={() => !isProcessing && setShowRemoveDialog(true)}
          onShowNotesModal={() => !isProcessing && setShowNotesModal(true)}
          isProcessing={isProcessing}
        />
      </div>
      
      <AnimeBannerModals 
        anime={anime}
        inUserList={inUserList}
        showListModal={showListModal}
        showProgressModal={showProgressModal}
        showScoreModal={showScoreModal}
        setShowListModal={setShowListModal}
        setShowProgressModal={setShowProgressModal}
        setShowScoreModal={setShowScoreModal}
        onUpdateItem={handleUpdateItem}
        setInUserList={refreshListStatus}
      />
      
      <AnimeRemoveDialog
        showRemoveDialog={showRemoveDialog}
        setShowRemoveDialog={setShowRemoveDialog}
        onConfirmRemove={handleRemoveAnime}
        isProcessing={isProcessing}
      />
      
      {inUserList && (
        <AnimeNotesModal
          open={showNotesModal}
          onOpenChange={setShowNotesModal}
          inUserList={inUserList}
          onUpdate={handleNoteUpdate}
        />
      )}
    </div>
  );
}
