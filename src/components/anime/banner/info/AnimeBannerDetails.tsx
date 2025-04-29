
import { AnimeMedia } from "@/types/anime";

interface AnimeBannerDetailsProps {
  anime: AnimeMedia;
  studios: string;
  startDate: string;
}

export function AnimeBannerDetails({ anime, studios, startDate }: AnimeBannerDetailsProps) {
  return (
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
  );
}
