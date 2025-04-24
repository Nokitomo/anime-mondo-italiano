
import { Link } from "react-router-dom";
import { AnimeMedia } from "@/types/anime";
import { formatLabels } from "@/types/anime";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AnimeCardProps {
  anime: AnimeMedia;
  showBadge?: boolean;
}

export function AnimeCard({ anime, showBadge = true }: AnimeCardProps) {
  const formatType = formatLabels[anime.format] || anime.format;
  
  return (
    <Link to={`/anime/${anime.id}`} className="block">
      <Card className="anime-card group h-full">
        <div className="relative overflow-hidden">
          <img 
            src={anime.coverImage.large} 
            alt={anime.title.romaji} 
            className="anime-card-image transition-transform duration-300 group-hover:scale-105"
          />
          {showBadge && (
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="text-xs font-medium">
                {anime.type === "ANIME" ? formatType : "Manga"}
              </Badge>
            </div>
          )}
          {anime.averageScore > 0 && (
            <div className="absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs font-semibold">
              ⭐ {anime.averageScore}%
            </div>
          )}
        </div>
        <CardContent className="p-3">
          <h3 className="font-semibold line-clamp-2 text-sm">
            {anime.title.userPreferred || anime.title.romaji}
          </h3>
        </CardContent>
      </Card>
    </Link>
  );
}

export function AnimeCardSkeleton() {
  return (
    <Card className="anime-card h-full">
      <div className="aspect-[3/4] w-full bg-muted animate-pulse"></div>
      <CardContent className="p-3">
        <div className="h-5 bg-muted animate-pulse rounded-md"></div>
      </CardContent>
    </Card>
  );
}
