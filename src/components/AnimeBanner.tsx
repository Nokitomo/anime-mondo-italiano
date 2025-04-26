// src/components/AnimeBanner.tsx
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { AnimeMedia } from "@/types/anime"
import {
  checkAnimeInUserList,
  AnimeListItem,
  removeAnimeFromList,
} from "@/services/supabase-service"
import { AnimeRemoveDialog } from "./anime/banner/AnimeRemoveDialog"
import { formatLabels, statusLabels } from "@/types/anime"
import { AddToListModal } from "./anime/AnimeAddToListModal"
import { ProgressModal } from "./anime/AnimeProgressModal"
import { ScoreModal } from "./anime/AnimeScoreModal"

interface AnimeBannerProps {
  anime: AnimeMedia
}

export function AnimeBanner({ anime }: AnimeBannerProps) {
  const [inUserList, setInUserList] = useState<AnimeListItem | null>(null)
  const [showRemoveDialog, setShowRemoveDialog] = useState(false)
  const [showListModal, setShowListModal] = useState(false)
  const [showProgressModal, setShowProgressModal] = useState(false)
  const [showScoreModal, setShowScoreModal] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      if (!anime.id) return
      const result = await checkAnimeInUserList(anime.id)
      setInUserList(result)
    }
    load()
  }, [anime.id])

  // handler di rimozione (se necessario)
  const handleRemoveAnime = async () => {
    if (!inUserList) return
    await removeAnimeFromList(inUserList.id)
    setInUserList(null)
    toast({ title: "Anime rimosso dalla lista" })
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
          {/* Cover */}
          <div className="w-24 sm:w-32 md:w-48 flex-shrink-0">
            <img
              src={anime.coverImage.large}
              alt={anime.title.romaji}
              className="w-full rounded-md shadow-lg"
            />
          </div>

          {/* Titolo + Metadati */}
          <div className="flex-1 space-y-2">
            <h1 className="text-xl font-bold">{anime.title.romaji}</h1>
            <p className="text-sm uppercase">{anime.studios?.nodes.map(s=>s.name).join(", ")}</p>
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

        {/* ========== BARRA AZIONI ========== */}
        <div className="mt-6 flex justify-center md:justify-start gap-4">
          <button
            className="px-4 py-2 bg-primary text-white rounded-md"
            onClick={() => setShowListModal(true)}
          >
            {inUserList ? "Modifica lista" : "Aggiungi alla lista"}
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

      {/* ========== MODALI ========== */}
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
        onUpdate={(newProg) =>
          setInUserList((prev) => prev && { ...prev, progress: newProg })
        }
      />

      <ScoreModal
        anime={anime}
        initialScore={inUserList?.score ?? null}
        open={showScoreModal}
        onClose={() => setShowScoreModal(false)}
        onUpdate={(newScore) =>
          setInUserList((prev) => prev && { ...prev, score: newScore })
        }
      />

      {/* vecchio dialog di conferma rimozione, se ti serve ancora */}
      <AnimeRemoveDialog
        showRemoveDialog={showRemoveDialog}
        setShowRemoveDialog={setShowRemoveDialog}
        onConfirmRemove={handleRemoveAnime}
      />
    </div>
  )
}