
import { useEffect, useState } from "react";
import { AnimeMedia } from "@/types/anime";
import { checkAnimeInUserList, AnimeListItem, removeAnimeFromList } from "@/services/supabase-service";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { AnimeAddToList } from "./anime/AnimeAddToList";
import { AnimeListControls } from "./anime/AnimeListControls";
import { AnimeRemoveDialog } from "./anime/banner/AnimeRemoveDialog";
import { AnimeBannerActions } from "./anime/banner/AnimeBannerActions";
import { AnimeBannerInfo } from "./anime/banner/AnimeBannerInfo";

interface AnimeBannerProps {
  anime: AnimeMedia;
}

export function AnimeBanner({ anime }: AnimeBannerProps) {
  const [inUserList, setInUserList] = useState<AnimeListItem | null>(null);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
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
  
  const handleRemoveAnime = async () => {
    if (!inUserList) return;
    
    try {
      await removeAnimeFromList(inUserList.id);
      setInUserList(null);
      
      toast({
        title: "Anime rimosso",
        description: "L'anime è stato rimosso dalla tua lista.",
      });
      
      setShowRemoveDialog(false);
    } catch (error) {
      console.error("Errore nella rimozione dell'anime:", error);
      toast({
        title: "Errore",
        description: "Impossibile rimuovere l'anime dalla lista.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveAndRedirect = async () => {
    await handleRemoveAnime();
    navigate('/lista');
  };
  
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
          
          <div className="space-y-4 flex-1">
            <div className="flex justify-between items-start">
              <AnimeBannerInfo
                anime={anime}
                studios={studios}
                startDate={startDate}
                nextEpisodeFormatted={nextEpisodeFormatted}
              />
              
              {inUserList && (
                <AnimeBannerActions
                  onRemoveClick={() => setShowRemoveDialog(true)}
                />
              )}
            </div>
            
            <div className="pt-2">
              {!inUserList ? (
                <AnimeAddToList 
                  anime={anime} 
                  inUserList={inUserList} 
                  onListUpdate={setInUserList} 
                />
              ) : (
                <AnimeListControls
                  anime={anime}
                  inUserList={inUserList}
                  onListUpdate={setInUserList}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimeRemoveDialog
        showRemoveDialog={showRemoveDialog}
        setShowRemoveDialog={setShowRemoveDialog}
        onConfirmRemove={handleRemoveAndRedirect}
      />
    </div>
  );
}
