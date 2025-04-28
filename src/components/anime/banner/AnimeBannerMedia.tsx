
import { AnimeMedia } from "@/types/anime";

interface AnimeBannerMediaProps {
  anime: AnimeMedia;
}

export function AnimeBannerMedia({ anime }: AnimeBannerMediaProps) {
  return (
    <>
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
      <div className="w-24 sm:w-32 md:w-48 flex-shrink-0">
        <img
          src={anime.coverImage.large}
          alt={anime.title.romaji}
          className="w-full rounded-md shadow-lg"
        />
      </div>
    </>
  );
}
