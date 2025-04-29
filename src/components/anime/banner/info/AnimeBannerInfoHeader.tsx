
import { AnimeTitle } from "../../AnimeTitle";
import { AnimeMetadata } from "../../AnimeMetadata";
import { AnimeMedia } from "@/types/anime";

interface AnimeBannerInfoHeaderProps {
  anime: AnimeMedia;
  nextEpisodeFormatted: string | null;
}

export function AnimeBannerInfoHeader({ anime, nextEpisodeFormatted }: AnimeBannerInfoHeaderProps) {
  return (
    <div className="flex flex-col gap-2">
      <AnimeTitle title={anime.title} />
      <AnimeMetadata anime={anime} nextEpisodeFormatted={nextEpisodeFormatted} />
    </div>
  );
}
