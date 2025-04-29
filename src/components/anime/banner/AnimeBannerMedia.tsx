
import { AnimeMedia } from "@/types/anime";

interface AnimeBannerMediaProps {
  anime: AnimeMedia;
}

export function AnimeBannerMedia({ anime }: AnimeBannerMediaProps) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {anime.bannerImage && (
        <div className="absolute inset-0 opacity-20 hidden sm:block">
          <img
            src={anime.bannerImage}
            alt={anime.title.romaji}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        </div>
      )}
    </div>
  );
}
