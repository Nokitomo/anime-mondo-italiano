
import { Badge } from "@/components/ui/badge";
import { AnimeMedia } from "@/types/anime";
import { AnimeTitle } from "../AnimeTitle";
import { AnimeMetadata } from "../AnimeMetadata";

interface AnimeBannerInfoProps {
  anime: AnimeMedia;
  studios: string;
  startDate: string;
  nextEpisodeFormatted: string | null;
}

export function AnimeBannerInfo({ anime, studios, startDate, nextEpisodeFormatted }: AnimeBannerInfoProps) {
  return (
    <>
      <AnimeTitle title={anime.title} />
      <AnimeMetadata anime={anime} nextEpisodeFormatted={nextEpisodeFormatted} />
      
      {nextEpisodeFormatted && anime.status === "RELEASING" && (
        <div className="text-sm my-2 py-1 px-2 bg-anime-primary/20 inline-block rounded-md">
          {nextEpisodeFormatted}
        </div>
      )}
      
      <div className="text-sm">
        <p className="mb-1"><span className="opacity-70">Studio:</span> {studios}</p>
        <p><span className="opacity-70">Anno:</span> {startDate}</p>
        <p><span className="opacity-70">Stato:</span> {
          anime.status === "FINISHED" ? "Completato" :
          anime.status === "RELEASING" ? "In corso" :
          anime.status === "NOT_YET_RELEASED" ? "Non ancora rilasciato" :
          anime.status === "CANCELLED" ? "Cancellato" : anime.status
        }</p>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {anime.genres?.map((genre, index) => (
          <Badge key={index} variant="secondary" className="bg-anime-primary/90">
            {genre}
          </Badge>
        ))}
      </div>
    </>
  );
}
