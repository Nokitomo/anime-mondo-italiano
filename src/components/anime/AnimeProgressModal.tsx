
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
import { toast } from "@/hooks/use-toast"
import type { AnimeMedia } from "@/types/anime"
import { checkAnimeInUserList, updateAnimeInList, addAnimeToList } from "@/services/supabase-service"

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

  React.useEffect(() => {
    if (!open) return
    let mounted = true
    checkAnimeInUserList(anime.id).then((item) => {
      if (!mounted) return
      setItemId(item?.id ?? null)
      setProgress(item?.progress ?? initialProgress)
    })
    return () => {
      mounted = false
    }
  }, [anime.id, open, initialProgress])

  const clamp = (n: number) => {
    if (anime.episodes != null) {
      return Math.max(0, Math.min(anime.episodes, n))
    }
    return Math.max(0, n)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      let updatedRow
      if (itemId) {
        const [updated] = await updateAnimeInList(itemId, { progress })
        updatedRow = updated
      } else {
        // se non esiste ancora entry, creala con default status "IN_CORSO"
        const [created] = await addAnimeToList(
          anime.id,
          "IN_CORSO",
          progress,
          0,
          ""
        )
        updatedRow = created
      }
      onUpdate(updatedRow.progress)
      toast("Progresso salvato!")
      onClose()
    } catch (error: any) {
      console.error("Errore salvataggio progresso:", error)
      toast("Errore", {
        description: "Non è stato possibile salvare il progresso.",
        variant: "destructive",
      })
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

        <div className="flex items-center justify-center py-4 space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setProgress((p) => clamp(p - 1))}
            disabled={loading || progress <= 0}
          >
            −
          </Button>

          <div className="flex flex-col items-center">
            <input
              type="number"
              className="w-16 text-center text-2xl font-semibold bg-transparent border-b-2 focus:outline-none"
              value={progress}
              min={0}
              max={anime.episodes ?? undefined}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10)
                setProgress(isNaN(val) ? 0 : clamp(val))
              }}
            />
            <span className="text-sm text-muted-foreground">
              / {anime.episodes ?? "?"} EP
            </span>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setProgress((p) => clamp(p + 1))}
            disabled={
              loading ||
              (anime.episodes != null && progress >= anime.episodes)
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
