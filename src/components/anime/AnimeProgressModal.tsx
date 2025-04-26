// src/components/anime/AnimeProgressModal.tsx
import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { AnimeMedia } from "@/types/anime"
import { checkAnimeInUserList, updateAnimeInList } from "@/services/supabase-service"

interface ProgressModalProps {
  anime: AnimeMedia
  initialProgress: number
  open: boolean
  onClose: () => void
  onUpdate: (newProgress: number) => void
}

export function ProgressModal({
  anime,
  initialProgress,
  open,
  onClose,
  onUpdate,
}: ProgressModalProps) {
  const [progress, setProgress] = React.useState(initialProgress)
  const [loading, setLoading] = React.useState(false)
  const [itemId, setItemId] = React.useState<string | null>(null)

  // Al primo open, carico l'ID e il progresso corrente
  React.useEffect(() => {
    if (!open) return
    let mounted = true
    checkAnimeInUserList(anime.id).then((item) => {
      if (!mounted) return
      setItemId(item?.id ?? null)
      setProgress(item?.progress ?? 0)
    })
    return () => {
      mounted = false
    }
  }, [anime.id, open])

  const handleSubmit = async () => {
    if (!itemId) return
    setLoading(true)
    try {
      const [updated] = await updateAnimeInList(itemId, { progress })
      onUpdate(updated.progress)
      onClose()
    } catch {
      // gestisci errore se vuoi
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Aggiorna Progresso</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center py-4 space-x-6">
          <Button
            variant="outline"
            onClick={() => setProgress((p) => Math.max(0, p - 1))}
            disabled={progress <= 0 || loading}
          >
            −
          </Button>
          <span className="text-2xl font-semibold">
            {progress} / {anime.episodes ?? "?"} EP
          </span>
          <Button
            variant="outline"
            onClick={() =>
              setProgress((p) =>
                anime.episodes != null ? Math.min(anime.episodes, p + 1) : p + 1
              )
            }
            disabled={
              loading || (anime.episodes != null && progress >= anime.episodes)
            }
          >
            +
          </Button>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Annulla
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            Salva
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}