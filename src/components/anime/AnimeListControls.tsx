
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { addAnimeToList, AnimeListItem, removeAnimeFromList } from "@/services/supabase-service";
import { AnimeMedia, AnimeStatus, statusLabels } from "@/types/anime";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Minus, Plus, Save } from "lucide-react";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AnimeListControlsProps {
  anime: AnimeMedia;
  inUserList: AnimeListItem | null;
  onListUpdate: (updated: AnimeListItem | null) => void;
  onRemove?: () => void;
}

export const AnimeListControls = ({ anime, inUserList, onListUpdate, onRemove }: AnimeListControlsProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notesValue, setNotesValue] = useState(inUserList?.notes || "");
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);

  const form = useForm({
    defaultValues: {
      notes: inUserList?.notes || "",
    }
  });

  const handleStatusChange = async (newStatus: AnimeStatus) => {
    try {
      setIsSubmitting(true);
      // If status is set to COMPLETATO, set progress to maximum episodes
      const newProgress = newStatus === "COMPLETATO" && anime.episodes 
        ? anime.episodes 
        : inUserList?.progress || 0;
      
      await addAnimeToList(
        anime.id,
        newStatus,
        newProgress,
        inUserList?.score || 0,
        inUserList?.notes || "",
        anime.title.userPreferred || anime.title.romaji,
        anime.coverImage.large,
        anime.format
      );
      
      // Aggiorna lo stato locale
      const updated = { 
        ...inUserList, 
        status: newStatus,
        progress: newProgress 
      } as AnimeListItem;
      
      onListUpdate(updated);
      
      toast({
        title: "Stato aggiornato",
        description: `Lo stato è stato aggiornato a ${statusLabels[newStatus]}.`,
      });
    } catch (error) {
      console.error("Errore nell'aggiornamento dello stato:", error);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare lo stato.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProgressChange = async (increment: number) => {
    const newProgress = Math.max(0, (inUserList?.progress || 0) + increment);
    try {
      setIsSubmitting(true);
      await addAnimeToList(
        anime.id,
        inUserList?.status || "IN_CORSO",
        newProgress,
        inUserList?.score || 0,
        inUserList?.notes || "",
        anime.title.userPreferred || anime.title.romaji,
        anime.coverImage.large,
        anime.format
      );
      
      // Aggiorna lo stato locale
      const updated = { ...inUserList, progress: newProgress } as AnimeListItem;
      onListUpdate(updated);
      
      toast({
        title: "Progresso aggiornato",
        description: `Progresso aggiornato a ${newProgress} episodi.`,
      });
    } catch (error) {
      console.error("Errore nell'aggiornamento del progresso:", error);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare il progresso.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScoreChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newScore = parseInt(event.target.value) || 0;
    if (newScore < 0 || newScore > 10) return;
    
    try {
      setIsSubmitting(true);
      await addAnimeToList(
        anime.id,
        inUserList?.status || "IN_CORSO",
        inUserList?.progress || 0,
        newScore,
        inUserList?.notes || "",
        anime.title.userPreferred || anime.title.romaji,
        anime.coverImage.large,
        anime.format
      );
      
      // Aggiorna lo stato locale
      const updated = { ...inUserList, score: newScore } as AnimeListItem;
      onListUpdate(updated);
      
      toast({
        title: "Voto aggiornato",
        description: `Voto aggiornato a ${newScore}/10.`,
      });
    } catch (error) {
      console.error("Errore nell'aggiornamento del voto:", error);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare il voto.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotesValue(event.target.value);
    setShowSaveButton(true);
  };

  const saveNotes = async () => {
    try {
      setIsSubmitting(true);
      await addAnimeToList(
        anime.id,
        inUserList?.status || "IN_CORSO",
        inUserList?.progress || 0,
        inUserList?.score || 0,
        notesValue,
        anime.title.userPreferred || anime.title.romaji,
        anime.coverImage.large,
        anime.format
      );
      
      // Aggiorna lo stato locale
      const updated = { ...inUserList, notes: notesValue } as AnimeListItem;
      onListUpdate(updated);
      
      setShowSaveButton(false);
      
      toast({
        title: "Note aggiornate",
        description: "Le tue note sono state salvate con successo.",
      });
    } catch (error) {
      console.error("Errore nell'aggiornamento delle note:", error);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare le note.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveAnime = async () => {
    if (!inUserList) return;
    
    try {
      setIsSubmitting(true);
      await removeAnimeFromList(inUserList.id);
      
      // Aggiorna lo stato locale
      onListUpdate(null);
      
      toast({
        title: "Anime rimosso",
        description: "L'anime è stato rimosso dalla tua lista.",
      });
      
      if (onRemove) {
        onRemove();
      }
      
      setShowRemoveDialog(false);
    } catch (error) {
      console.error("Errore nella rimozione dell'anime:", error);
      toast({
        title: "Errore",
        description: "Impossibile rimuovere l'anime dalla lista.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!inUserList) return null;

  return (
    <>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Stato</Label>
            <Select
              value={inUserList.status}
              onValueChange={(value) => handleStatusChange(value as AnimeStatus)}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleziona uno stato" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(statusLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Progresso</Label>
            <div className="flex items-center space-x-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleProgressChange(-1)}
                disabled={isSubmitting || inUserList.progress <= 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="min-w-[40px] text-center">{inUserList.progress}</span>
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleProgressChange(1)}
                disabled={isSubmitting}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Voto (0-10)</Label>
            <Input
              type="number"
              min="0"
              max="10"
              value={inUserList.score}
              onChange={handleScoreChange}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Note personali</Label>
            {showSaveButton && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={saveNotes} 
                disabled={isSubmitting}
              >
                <Save className="h-4 w-4 mr-2" />
                Salva
              </Button>
            )}
          </div>
          <Textarea
            value={notesValue}
            onChange={handleNotesChange}
            placeholder="Aggiungi note personali..."
            disabled={isSubmitting}
          />
        </div>
      </div>

      <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Conferma eliminazione</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler rimuovere questo anime dalla tua lista? Questa azione non può essere annullata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveAnime} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Rimuovi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
