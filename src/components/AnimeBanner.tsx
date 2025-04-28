
// src/components/AnimeBanner.tsx
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "@/hooks/use-toast"
import type { AnimeMedia } from "@/types/anime"
import {
  checkAnimeInUserList,
  AnimeListItem,
  removeAnimeFromList,
  addAnimeToList,
  updateAnimeInList
} from "@/services/supabase-service"
import { formatLabels, statusLabels } from "@/types/anime"
import { AddToListModal } from "./anime/AnimeAddToListModal"
import { ProgressModal } from "./anime/AnimeProgressModal"
import { ScoreModal } from "./anime/AnimeScoreModal"
import { AnimeRemoveDialog } from "./anime/banner/AnimeRemoveDialog"
import { useAuth } from "@/hooks/useAuth"

interface AnimeBannerProps {
  anime: AnimeMedia
}

export function AnimeBanner({ anime }: AnimeBannerProps) {
  const { user } = useAuth();
  const [inUserList, setInUserList] = useState<AnimeListItem | null>(null)
  const [showListModal, setShowListModal] = useState(false)
  const [showProgressModal, setShowProgressModal] = useState(false)
  const [showScoreModal, setShowScoreModal] = useState(false)
  const [showRemoveDialog, setShowRemoveDialog] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    async function loadListStatus() {
      if (!anime.id || !user) return
      const item = await checkAnimeInUserList(anime.id)
      setInUserList(item)
    }
    loadListStatus()
  }, [anime.id, user])

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
        // Aggiungiamo l'anime con tutti i dettagli necessari
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
        
        // Assicuriamoci che anche i metadati vengano aggiornati se non sono presenti
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
  }

  const handleRemoveAnime = async () => {
    if (!inUserList) return
    await removeAnimeFromList(inUserList.id)
    setInUserList(null)
    toast("Anime rimosso dalla lista")
    setShowRemoveDialog(false)
  }

  return (
    <div className="relative bg-black text-white overflow-hidden">
      {anime.bannerImage && (
        <div className="absolute inset-0 opacity-20 hidden sm:block">
          <img
            src={anime.bannerImage}
            alt={anime.title.romaji}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        </div>
      )}
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
            <h1 className="text-xl font-bold">{anime.title.romaji}</h1>
            <p className="text-sm uppercase">
              {anime.studios?.nodes.map((s) => s.name).join(", ")}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 text-xs">
              <div>
                <dt className="font-medium">Tipo</dt>
                <dd>{formatLabels[anime.format] || anime.format}</dd>
              </div>
              <div>
                <dt className="font-medium">Episodi</dt>
                <dd>{anime.episodes ?? "—"}</dd>
              </div>
              <div>
                <dt className="font-medium">Stato</dt>
                <dd>{statusLabels[anime.status] || anime.status}</dd>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-center md:justify-start gap-4">
          <button
            className="px-4 py-2 bg-primary text-white rounded-md"
            onClick={() => setShowListModal(true)}
          >
            {inUserList
              ? statusLabels[inUserList.status]
              : "Aggiungi alla lista"}
          </button>
          <button
            className="px-4 py-2 bg-secondary text-white rounded-md"
            onClick={() => setShowProgressModal(true)}
          >
            {inUserList
              ? `${inUserList.progress} / ${anime.episodes ?? "?"} EP`
              : `— / ${anime.episodes ?? "?"} EP`}
          </button>
          <button
            className="px-4 py-2 bg-secondary text-white rounded-md"
            onClick={() => setShowScoreModal(true)}
          >
            {inUserList && inUserList.score != null
              ? `${inUserList.score} / 10`
              : "Non votato"}
          </button>
        </div>
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
  )
}
