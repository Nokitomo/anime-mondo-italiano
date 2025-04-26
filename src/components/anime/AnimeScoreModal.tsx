// src/components/anime/AnimeScoreModal.tsx
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

interface ScoreModalProps {
  anime: AnimeMedia
  initialScore: number | null
  open: boolean
  onClose: () => void
  onUpdate: (newScore: number) => void
}

export function ScoreModal({
  anime,
  initialScore,
  open,
  onClose,
  onUpdate,
}: ScoreModalProps) {
  const [score, setScore] = React.useState<number>(initialScore ?? 0)
  const [loading, setLoading] = React.useState(false)
  const [itemId, setItemId] = React.useState<string | null>(null)

  // Al primo open, carico l'ID e il punteggio corrente
  React.useEffect(() => {
    if (!open) return
    let mounted = true
    checkAnimeInUserList(anime.id).then((item) => {
      if (!mounted) return
      setItemId(item?.id ?? null)
      setScore(item?.score ?? 0)
    })
    return () => {
      mounted = false
    }
  }, [anime.id, open])

  const handleSubmit = async () => {
    if (!itemId) return
    setLoading(true)
    try {
      const [updated] = await updateAnimeInList(itemId, { score })
      onUpdate(updated.score)
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
          <DialogTitle>Assegna un Voto</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center py-4 space-x-6">
          <Button
            variant="outline"
            onClick={() => setScore((s) => Math.max(0, s - 1))}
            disabled={score <= 0 || loading}
          >
            −
          </Button>
          <span className="text-2xl font-semibold">{score} / 10</span>
          <Button
            variant="outline"
            onClick={() => setScore((s) => Math.min(10, s + 1))}
            disabled={score >= 10 || loading}
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