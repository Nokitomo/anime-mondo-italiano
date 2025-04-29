
import { AnimeMedia } from "@/types/anime";
import { AnimeBannerMedia } from "./AnimeBannerMedia";
import { AnimeBannerContent } from "./AnimeBannerContent";
import { AnimeBannerModals } from "./AnimeBannerModals";
import { AnimeListItem } from "@/services/supabase-service";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  checkAnimeInUserList,
  removeAnimeFromList,
  addAnimeToList,
  updateAnimeInList
} from "@/services/supabase-service";
import { toast } from "@/hooks/use-toast";
import { AnimeRemoveDialog } from "./AnimeRemoveDialog";
import { AnimeNotesModal } from "@/components/anime/AnimeNotesModal";

interface AnimeBannerContainerProps {
  anime: AnimeMedia;
  onUpdateNotes?: (anime: AnimeListItem) => void;
}

export function AnimeBannerContainer({ anime, onUpdateNotes }: AnimeBannerContainerProps) {
  const { user } = useAuth();
  const [inUserList, setInUserList] = useState<AnimeListItem | null>(null);
  const [showListModal, setShowListModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [nextEpisodeFormatted, setNextEpisodeFormatted] = useState<string | null>(null);

  useEffect(() => {
    async function loadListStatus() {
      if (!anime.id || !user) return;
      const item = await checkAnimeInUserList(anime.id);
      setInUserList(item);
    }
    loadListStatus();
  }, [anime.id, user]);
  
  useEffect(() => {
    if (anime.nextAiringEpisode) {
      const { timeUntilAiring, episode } = anime.nextAiringEpisode;
      
      // Converti i secondi in giorni e ore
      const days = Math.floor(timeUntilAiring / 86400);
      const hours = Math.floor((timeUntilAiring % 86400) / 3600);
      
      let timeText = "";
      if (days > 0) {
        timeText += `${days} ${days === 1 ? 'giorno' : 'giorni'}`;
      }
      
      if (hours > 0 || days === 0) {
        if (days > 0) timeText += ' e ';
        timeText += `${hours} ${hours === 1 ? 'ora' : 'ore'}`;
      }
      
      setNextEpisodeFormatted(`L'episodio ${episode} va in onda tra ${timeText}`);
    } else {
      setNextEpisodeFormatted(null);
    }
  }, [anime.nextAiringEpisode]);

  const handleUpdateItem = async (newStatus: AnimeListItem["status"] | null, newProgress?: number, newScore?: number) => {
    try {
      if (!user) {
        toast({
          title: "Accesso richiesto",
          description: "Devi accedere per modificare la tua lista",
          variant: "destructive"
        });
        return;
      }

      if (!inUserList && newStatus) {
        const title = anime.title.userPreferred || anime.title.romaji || anime.title.english || anime.title.native;
        const coverImage = anime.coverImage?.large || anime.coverImage?.medium || "";
        const format = anime.format || "";

        const [data] = await addAnimeToList(
          anime.id, 
          newStatus, 
          newProgress !== undefined ? newProgress : 0, 
          newScore !== undefined ? newScore : 0,
          "",
          title,
          coverImage,
          format
        );
        setInUserList(data);
      } else if (inUserList) {
        const updates: Record<string, any> = {};
        
        if (newStatus) updates.status = newStatus;
        if (newProgress !== undefined) updates.progress = newProgress;
        if (newScore !== undefined) updates.score = newScore;
        
        if (!inUserList.title) {
          updates.title = anime.title.userPreferred || anime.title.romaji || anime.title.english || anime.title.native;
        }
        if (!inUserList.cover_image) {
          updates.cover_image = anime.coverImage?.large || anime.coverImage?.medium || "";
        }
        if (!inUserList.format) {
          updates.format = anime.format || "";
        }
        
        const [data] = await updateAnimeInList(inUserList.id, updates);
        setInUserList(data);
      }
    } catch (error) {
      console.error("Errore nell'aggiornamento dello stato:", error);
      toast({
        title: "Errore",
        description: "Non è stato possibile aggiornare lo stato.",
        variant: "destructive"
      });
    }
  };

  const handleRemoveAnime = async () => {
    try {
      if (!inUserList) return;
      await removeAnimeFromList(inUserList.id);
      setInUserList(null);
      toast({
        title: "Anime rimosso dalla lista"
      });
      setShowRemoveDialog(false);
    } catch (error) {
      console.error("Errore nella rimozione dell'anime:", error);
      toast({
        title: "Errore",
        description: "Non è stato possibile rimuovere l'anime dalla lista.",
        variant: "destructive"
      });
    }
  };

  const handleNoteUpdate = (updatedAnime: AnimeListItem) => {
    setInUserList(updatedAnime);
    if (onUpdateNotes) {
      onUpdateNotes(updatedAnime);
    }
  };

  const studios = anime.studios?.nodes.map((s) => s.name).join(", ");
  
  return (
    <div className="relative bg-black text-white overflow-hidden">
      <AnimeBannerMedia anime={anime} />
      
      <div className="container relative z-10 py-6 px-4 sm:px-6 md:py-12">
        <AnimeBannerContent 
          anime={anime}
          studios={studios}
          inUserList={inUserList}
          nextEpisodeFormatted={nextEpisodeFormatted}
          onShowListModal={() => setShowListModal(true)}
          onShowProgressModal={() => setShowProgressModal(true)}
          onShowScoreModal={() => setShowScoreModal(true)}
          onShowRemoveDialog={() => setShowRemoveDialog(true)}
          onShowNotesModal={() => setShowNotesModal(true)}
        />
      </div>
      
      <AnimeBannerModals 
        anime={anime}
        inUserList={inUserList}
        showListModal={showListModal}
        showProgressModal={showProgressModal}
        showScoreModal={showScoreModal}
        setShowListModal={setShowListModal}
        setShowProgressModal={setShowProgressModal}
        setShowScoreModal={setShowScoreModal}
        onUpdateItem={handleUpdateItem}
        setInUserList={setInUserList}
      />
      
      <AnimeRemoveDialog
        showRemoveDialog={showRemoveDialog}
        setShowRemoveDialog={setShowRemoveDialog}
        onConfirmRemove={handleRemoveAnime}
      />
      
      {inUserList && (
        <AnimeNotesModal
          open={showNotesModal}
          onOpenChange={setShowNotesModal}
          inUserList={inUserList}
          onUpdate={handleNoteUpdate}
        />
      )}
    </div>
  );
}
