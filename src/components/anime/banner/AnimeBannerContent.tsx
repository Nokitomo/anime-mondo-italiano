
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
}

export function AnimeBannerContent({
  anime,
  studios,
  inUserList,
  nextEpisodeFormatted,
  onShowListModal,
  onShowProgressModal,
  onShowScoreModal,
  onShowRemoveDialog
}: AnimeBannerContentProps) {
  const startDate = `${anime.startDate?.year || "?"}`;
  
  return (
    <div className="flex flex-col items-center text-center gap-4 md:flex-row md:items-start md:text-left">
      <div className="w-24 sm:w-32 md:w-48 flex-shrink-0">
        <img
          src={anime.coverImage.large}
          alt={anime.title.romaji}
          className="w-full rounded-md shadow-lg"
        />
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex justify-between items-start">
          <AnimeBannerInfo 
            anime={anime} 
            studios={studios}
            startDate={startDate}
            nextEpisodeFormatted={nextEpisodeFormatted}
          />
          
          {inUserList && (
            <div className="hidden sm:block">
              <AnimeBannerActions onRemoveClick={onShowRemoveDialog} />
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
