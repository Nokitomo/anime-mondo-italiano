
import { AnimeMedia } from "@/types/anime";
import { AnimeBannerInfoHeader } from "./AnimeBannerInfoHeader";
import { AnimeBannerDetails } from "./AnimeBannerDetails";
import { AnimeBannerGenres } from "./AnimeBannerGenres";

interface AnimeBannerInfoProps {
  anime: AnimeMedia;
  studios: string;
  startDate: string;
  nextEpisodeFormatted: string | null;
}

export function AnimeBannerInfo({ anime, studios, startDate, nextEpisodeFormatted }: AnimeBannerInfoProps) {
  return (
    <div className="flex flex-col gap-2">
      <AnimeBannerInfoHeader 
        anime={anime} 
        nextEpisodeFormatted={nextEpisodeFormatted} 
      />
      
      <AnimeBannerDetails 
        anime={anime}
        studios={studios}
        startDate={startDate}
      />
      
      <AnimeBannerGenres genres={anime.genres || []} />
    </div>
  );
}
