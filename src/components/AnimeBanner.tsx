
import { AnimeMedia } from "@/types/anime";
import { Button } from "@/components/ui/button";
import { formatLabels } from "@/types/anime";
import { Badge } from "@/components/ui/badge";

interface AnimeBannerProps {
  anime: AnimeMedia;
}

export function AnimeBanner({ anime }: AnimeBannerProps) {
  const formatType = formatLabels[anime.format] || anime.format;
  const studios = anime.studios?.nodes?.map(studio => studio.name).join(", ") || "Studio non disponibile";
  
  // Formattare la data di inizio
  const startDate = anime.startDate?.year 
    ? `${anime.startDate.month || '??'}.${anime.startDate.year}` 
    : 'Data sconosciuta';
  
  return (
    <div className="relative overflow-hidden bg-black text-white">
      {anime.bannerImage && (
        <div className="absolute inset-0 opacity-20">
          <img 
            src={anime.bannerImage} 
            alt={anime.title.romaji} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        </div>
      )}
      
      <div className="container relative z-10 py-8 md:py-12">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="shrink-0 w-32 md:w-48">
            <img 
              src={anime.coverImage.large} 
              alt={anime.title.romaji} 
              className="w-full rounded-md shadow-lg"
            />
          </div>
          
          <div className="space-y-4">
            <div>
              <h1 className="text-xl md:text-3xl font-bold mb-2">
                {anime.title.userPreferred || anime.title.romaji}
              </h1>
              {anime.title.native && (
                <p className="text-sm opacity-80 mb-2">{anime.title.native}</p>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-white/10 backdrop-blur-sm">
                {anime.type === "ANIME" ? formatType : "Manga"}
              </Badge>
              {anime.episodes && (
                <Badge variant="outline" className="bg-white/10 backdrop-blur-sm">
                  {anime.episodes} episodi
                </Badge>
              )}
              {anime.averageScore > 0 && (
                <Badge variant="outline" className="bg-white/10 backdrop-blur-sm">
                  ⭐ {anime.averageScore}%
                </Badge>
              )}
            </div>
            
            <div className="text-sm">
              <p className="mb-1"><span className="opacity-70">Studio:</span> {studios}</p>
              <p><span className="opacity-70">Anno:</span> {startDate}</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {anime.genres?.map((genre, index) => (
                <Badge key={index} variant="secondary" className="bg-anime-primary/90">
                  {genre}
                </Badge>
              ))}
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button className="bg-anime-primary hover:bg-anime-primary/90">
                Aggiungi alla lista
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
