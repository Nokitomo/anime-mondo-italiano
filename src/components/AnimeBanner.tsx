
import { useEffect, useState } from "react";
import { AnimeMedia } from "@/types/anime";
import { checkAnimeInUserList, AnimeListItem } from "@/services/supabase-service";
import { AnimeTitle } from "./anime/AnimeTitle";
import { AnimeMetadata } from "./anime/AnimeMetadata";
import { AnimeAddToList } from "./anime/AnimeAddToList";

interface AnimeBannerProps {
  anime: AnimeMedia;
}

export function AnimeBanner({ anime }: AnimeBannerProps) {
  const [inUserList, setInUserList] = useState<AnimeListItem | null>(null);
  
  const studios = anime.studios?.nodes?.map(studio => studio.name).join(", ") || "Studio non disponibile";
  const startDate = anime.startDate?.year 
    ? `${anime.startDate.month || '??'}.${anime.startDate.year}` 
    : 'Data sconosciuta';
    
  const nextEpisodeDate = anime.status === "RELEASING" && anime.nextAiringEpisode
    ? new Date(anime.nextAiringEpisode.airingAt * 1000)
    : null;
    
  const nextEpisodeFormatted = nextEpisodeDate 
    ? nextEpisodeDate.toLocaleDateString('it-IT', { day: 'numeric', month: 'long' })
    : null;

  useEffect(() => {
    const checkList = async () => {
      if (anime.id) {
        try {
          const result = await checkAnimeInUserList(anime.id);
          setInUserList(result);
        } catch (error) {
          console.error("Errore nel controllo anime nella lista:", error);
        }
      }
    };
    
    checkList();
  }, [anime.id]);
  
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
            <AnimeTitle title={anime.title} />
            <AnimeMetadata anime={anime} nextEpisodeFormatted={nextEpisodeFormatted} />
            
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
            
            <div className="flex gap-2 pt-2">
              <AnimeAddToList 
                anime={anime} 
                inUserList={inUserList} 
                onListUpdate={setInUserList} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
