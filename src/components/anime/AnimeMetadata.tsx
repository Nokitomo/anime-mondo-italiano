
import { Badge } from "@/components/ui/badge";
import { Calendar, FileVideo } from "lucide-react";
import { AnimeMedia, formatLabels } from "@/types/anime";

interface AnimeMetadataProps {
  anime: AnimeMedia;
  nextEpisodeFormatted?: string | null;
}

export const AnimeMetadata = ({ anime, nextEpisodeFormatted }: AnimeMetadataProps) => {
  const formatType = formatLabels[anime.format] || anime.format;
  
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="outline" className="bg-white/10 backdrop-blur-sm">
        {anime.type === "ANIME" ? formatType : "Manga"}
      </Badge>
      {anime.episodes && (
        <Badge variant="outline" className="bg-white/10 backdrop-blur-sm">
          <FileVideo className="w-3 h-3 mr-1" />
          {anime.episodes} episodi
        </Badge>
      )}
      {anime.nextAiringEpisode && anime.status === "RELEASING" && (
        <Badge variant="outline" className="bg-white/10 backdrop-blur-sm">
          <Calendar className="w-3 h-3 mr-1" />
          Ep. {anime.nextAiringEpisode.episode}
        </Badge>
      )}
      {anime.averageScore > 0 && (
        <Badge variant="outline" className="bg-white/10 backdrop-blur-sm">
          ⭐ {anime.averageScore}%
        </Badge>
      )}
    </div>
  );
};
