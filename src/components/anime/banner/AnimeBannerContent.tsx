
import { AnimeBannerInfo } from "./AnimeBannerInfo";
import { AnimeBannerControls } from "./AnimeBannerControls";
import { AnimeMedia } from "@/types/anime";
import { AnimeListItem } from "@/services/supabase-service";
import { AnimeBannerActions } from "./AnimeBannerActions";

interface AnimeBannerContentProps {
  anime: AnimeMedia;
  studios: string;
  inUserList: AnimeListItem | null;
  nextEpisodeFormatted: string | null;
  onShowListModal: () => void;
  onShowProgressModal: () => void;
  onShowScoreModal: () => void;
  onShowRemoveDialog: () => void;
  onShowNotesModal: () => void;
}

export function AnimeBannerContent({
  anime,
  studios,
  inUserList,
  nextEpisodeFormatted,
  onShowListModal,
  onShowProgressModal,
  onShowScoreModal,
  onShowRemoveDialog,
  onShowNotesModal
}: AnimeBannerContentProps) {
  const startDate = `${anime.startDate?.year || "?"}`;
  
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
      <div className="w-36 sm:w-40 md:w-48 flex-shrink-0">
        <img
          src={anime.coverImage.large}
          alt={anime.title.romaji}
          className="w-full rounded-md shadow-lg"
        />
      </div>
      <div className="flex-1 space-y-4 w-full text-center md:text-left">
        <div className="flex flex-col md:flex-row justify-between items-start">
          <AnimeBannerInfo 
            anime={anime} 
            studios={studios}
            startDate={startDate}
            nextEpisodeFormatted={nextEpisodeFormatted}
          />
          
          {inUserList && (
            <div className="mt-4 md:mt-0">
              <AnimeBannerActions 
                onRemoveClick={onShowRemoveDialog} 
                onEditNotes={onShowNotesModal}
              />
            </div>
          )}
        </div>
        
        <AnimeBannerControls
          anime={anime}
          inUserList={inUserList}
          onShowListModal={onShowListModal}
          onShowProgressModal={onShowProgressModal}
          onShowScoreModal={onShowScoreModal}
        />
      </div>
    </div>
  );
}
