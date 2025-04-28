
// src/components/anime/AnimeAddToListModal.tsx
import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
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
  { label: "In visione", value: "IN_CORSO" },
  { label: "Completato", value: "COMPLETATO" },
  { label: "In pausa", value: "IN_PAUSA" },
  { label: "Abbandonato", value: "ABBANDONATO" },
  { label: "Pianificato", value: "PIANIFICATO" },
  { label: "Rivisto", value: "REWATCH" },
]

export function AddToListModal({
  anime,
  initial,
  open,
  onClose,
  onUpdate,
}: AddToListModalProps) {
  const [status, setStatus] = React.useState<AnimeListItem["status"]>(
    initial?.status ?? "IN_CORSO"
  )
  const [loading, setLoading] = React.useState(false)

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
      
      // Prepara i dati necessari
      const title = anime.title.userPreferred || anime.title.romaji || anime.title.english || anime.title.native;
      const coverImage = anime.coverImage.large || anime.coverImage.medium || "";
      const format = anime.format || "";
      
      if (initial) {
        // Se stiamo aggiornando, assicuriamoci che i metadati vengano aggiornati se mancanti
        const updates: Record<string, any> = {
          status,
          progress: newProgress,
        };
        
        if (!initial.title) updates.title = title;
        if (!initial.cover_image) updates.cover_image = coverImage;
        if (!initial.format) updates.format = format;
        
        const [data] = await updateAnimeInList(initial.id, updates);
        updatedRow = data;
      } else {
        // Se stiamo aggiungendo, includi tutti i dati
        const [data] = await addAnimeToList(
          anime.id,
          status,
          newProgress,
          initial?.score ?? 0,
          "",
          title,
          coverImage,
          format
        );
        updatedRow = data;
      }

      onUpdate(updatedRow)
      toast("Lista aggiornata")
      onClose()
    } catch (error) {
      console.error("Errore AddToListModal:", error)
      toast("Errore", {
        description: "Non è stato possibile salvare lo stato.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent key={initial?.status}>
        <DialogHeader>
          <DialogTitle>
            {initial ? "Modifica stato nell'elenco" : "Aggiungi alla lista"}
          </DialogTitle>
          <DialogDescription>
            Seleziona lo stato per questo anime nella tua lista personale.
          </DialogDescription>
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
