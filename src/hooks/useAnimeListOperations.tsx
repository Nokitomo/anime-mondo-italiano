
import { useState, useCallback } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import {
  AnimeListItem,
  checkAnimeInUserList,
  removeAnimeFromList,
  addAnimeToList,
  updateAnimeInList
} from "@/services/supabase-service";
import { AnimeMedia } from "@/types/anime";

export function useAnimeListOperations(anime: AnimeMedia, onUpdate?: (anime: AnimeListItem) => void) {
  const { user } = useAuth();
  const [inUserList, setInUserList] = useState<AnimeListItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Funzione per ricaricare lo stato dell'anime nella lista utente
  const refreshListStatus = useCallback(async () => {
    if (!anime.id || !user) return null;
    try {
      const item = await checkAnimeInUserList(anime.id);
      setInUserList(item);
      return item;
    } catch (error) {
      console.error("Errore nel caricare lo stato dell'anime:", error);
      return null;
    }
  }, [anime.id, user]);

  const handleUpdateItem = async (newStatus: AnimeListItem["status"] | null, newProgress?: number, newScore?: number) => {
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      
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
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveAnime = async () => {
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      if (!inUserList) return;
      
      await removeAnimeFromList(inUserList.id);
      
      toast({
        title: "Anime rimosso dalla lista"
      });
      
      // Update parent component state
      if (onUpdate) {
        onUpdate({ ...inUserList, notes: "" });
      }
      
      // Update local state
      setInUserList(null);
    } catch (error) {
      console.error("Errore nella rimozione dell'anime:", error);
      toast({
        title: "Errore",
        description: "Non è stato possibile rimuovere l'anime dalla lista.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNoteUpdate = (updatedAnime: AnimeListItem) => {
    // Update local state
    setInUserList(updatedAnime);
    
    // Notify parent component of the update
    if (onUpdate) {
      onUpdate(updatedAnime);
    }
  };

  return {
    inUserList,
    isProcessing,
    refreshListStatus,
    handleUpdateItem,
    handleRemoveAnime,
    handleNoteUpdate,
    setInUserList
  };
}
