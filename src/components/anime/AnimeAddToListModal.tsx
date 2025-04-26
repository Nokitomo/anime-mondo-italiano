// src/components/anime/AnimeAddToListModal.tsx
import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import type { AnimeMedia } from "@/types/anime"
import type { AnimeListItem } from "@/services/supabase-service"
import { addAnimeToList, updateAnimeInList } from "@/services/supabase-service"

interface AddToListModalProps {
  anime: AnimeMedia
  initial: AnimeListItem | null
  open: boolean
  onClose: () => void
  onUpdate: (item: AnimeListItem | null) => void
}

const statusOptions: { label: string; value: AnimeListItem["status"] }[] = [
  { label: "In corso",    value: "IN_CORSO"   },
  { label: "Completato",  value: "COMPLETATO" },
  { label: "In pausa",    value: "IN_PAUSA"   },
  { label: "Abbandonato", value: "ABBANDONATO"},
  { label: "Pianificato", value: "PIANIFICATO"},
]

export function AddToListModal({
  anime,
  initial,
  open,
  onClose,
  onUpdate,
}: AddToListModalProps) {
  const { toast } = useToast()
  const [status, setStatus] = React.useState<AnimeListItem["status"]>(
    initial?.status ?? "IN_CORSO"
  )
  const [loading, setLoading] = React.useState(false)

  // All'apertura del modal riallinea il radio al valore corrente
  React.useEffect(() => {
    if (open) {
      setStatus(initial?.status ?? "IN_CORSO")
    }
  }, [open, initial])

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const newProgress =
        status === "COMPLETATO"
          ? anime.episodes ?? 0
          : status === "PIANIFICATO"
          ? 0
          : initial?.progress ?? 0

      let updatedRow: AnimeListItem
      if (initial) {
        const [data] = await updateAnimeInList(initial.id, {
          status,
          progress: newProgress,
        })
        updatedRow = data
      } else {
        const [data] = await addAnimeToList(
          anime.id,
          status,
          newProgress,
          initial?.score ?? 0,
          ""
        )
        updatedRow = data
      }

      onUpdate(updatedRow)
      toast({ title: "Lista aggiornata", variant: "default" })
      onClose()
    } catch (error) {
      console.error("Errore AddToListModal:", error)
      toast({
        title: "Errore",
        description: "Non è stato possibile salvare lo stato.",
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
          <DialogTitle>
            {initial ? "Modifica stato nell'elenco" : "Aggiungi alla lista"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {statusOptions.map((opt) => (
            <div key={opt.value} className="flex items-center">
              <input
                id={opt.value}
                name="status"
                type="radio"
                className="mr-2"
                value={opt.value}
                checked={status === opt.value}
                onChange={() => setStatus(opt.value)}
              />
              <label htmlFor={opt.value} className="text-sm">
                {opt.label}
              </label>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Annulla
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {initial ? "Aggiorna" : "Aggiungi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}