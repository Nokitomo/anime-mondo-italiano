
import React, { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import type { AnimeMedia } from "@/types/anime";
import {
  checkAnimeInUserList,
  AnimeListItem,
  removeAnimeFromList,
  addAnimeToList,
  updateAnimeInList,
} from "@/services/supabase-service";
import { AddToListModal } from "./anime/AnimeAddToListModal";
import { ProgressModal } from "./anime/AnimeProgressModal";
import { ScoreModal } from "./anime/AnimeScoreModal";
import { AnimeRemoveDialog } from "./anime/banner/AnimeRemoveDialog";
import { AnimeBannerControls } from "./anime/banner/AnimeBannerControls";
import { AnimeBannerInfo } from "./anime/banner/AnimeBannerInfo";
import { useAuth } from "@/hooks/useAuth";

interface AnimeBannerProps {
  anime: AnimeMedia;
}

export function AnimeBanner({ anime }: AnimeBannerProps) {
  const { user } = useAuth();
  const [inUserList, setInUserList] = useState<AnimeListItem | null>(null);
  const [showListModal, setShowListModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
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
        toast("Accesso richiesto", { 
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
      toast("Errore", {
        description: "Non è stato possibile aggiornare lo stato.",
        variant: "destructive"
      });
    }
  };

  const handleRemoveAnime = async () => {
    if (!inUserList) return;
    await removeAnimeFromList(inUserList.id);
    setInUserList(null);
    toast("Anime rimosso dalla lista");
    setShowRemoveDialog(false);
  };

  const studios = anime.studios?.nodes.map((s) => s.name).join(", ");

  return (
    <div className="relative bg-black text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20 hidden sm:block">
        {anime.bannerImage && (
          <>
            <img
              src={anime.bannerImage}
              alt={anime.title.romaji}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
          </>
        )}
      </div>
      
      <div className="container relative z-10 py-6 px-4 sm:px-6 md:py-12">
        <div className="flex flex-col items-center text-center gap-4 md:flex-row md:items-start md:text-left">
          <div className="w-24 sm:w-32 md:w-48 flex-shrink-0">
            <img
              src={anime.coverImage.large}
              alt={anime.title.romaji}
              className="w-full rounded-md shadow-lg"
            />
          </div>
          <div className="flex-1 space-y-2">
            <AnimeBannerInfo 
              anime={anime} 
              studios={studios}
              startDate={`${anime.startDate?.year || "?"}`}
              nextEpisodeFormatted={nextEpisodeFormatted}
            />
          </div>
        </div>
        
        <AnimeBannerControls
          anime={anime}
          inUserList={inUserList}
          onShowListModal={() => setShowListModal(true)}
          onShowProgressModal={() => setShowProgressModal(true)}
          onShowScoreModal={() => setShowScoreModal(true)}
        />
      </div>

      <AddToListModal
        anime={anime}
        initial={inUserList}
        open={showListModal}
        onClose={() => setShowListModal(false)}
        onUpdate={setInUserList}
      />

      <ProgressModal
        anime={anime}
        initialProgress={inUserList?.progress ?? 0}
        open={showProgressModal}
        onClose={() => setShowProgressModal(false)}
        onUpdate={(newProgress) => {
          handleUpdateItem(null, newProgress);
          setInUserList((prev) =>
            prev ? { ...prev, progress: newProgress } : prev
          );
        }}
      />

      <ScoreModal
        anime={anime}
        initialScore={inUserList?.score ?? null}
        open={showScoreModal}
        onClose={() => setShowScoreModal(false)}
        onUpdate={(newScore) => {
          handleUpdateItem(null, undefined, newScore);
          setInUserList((prev) =>
            prev ? { ...prev, score: newScore } : prev
          );
        }}
      />

      <AnimeRemoveDialog
        showRemoveDialog={showRemoveDialog}
        setShowRemoveDialog={setShowRemoveDialog}
        onConfirmRemove={handleRemoveAnime}
      />
    </div>
  );
}
