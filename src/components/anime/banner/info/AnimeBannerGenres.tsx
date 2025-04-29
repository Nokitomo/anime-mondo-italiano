
import { Badge } from "@/components/ui/badge";

interface AnimeBannerGenresProps {
  genres: string[];
}

export function AnimeBannerGenres({ genres }: AnimeBannerGenresProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {genres?.map((genre, index) => (
        <Badge key={index} variant="secondary" className="bg-anime-primary/90">
          {genre}
        </Badge>
      ))}
    </div>
  );
}
