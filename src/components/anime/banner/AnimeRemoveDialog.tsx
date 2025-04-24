
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface AnimeRemoveDialogProps {
  showRemoveDialog: boolean;
  setShowRemoveDialog: (show: boolean) => void;
  onConfirmRemove: () => void;
}

export function AnimeRemoveDialog({
  showRemoveDialog,
  setShowRemoveDialog,
  onConfirmRemove,
}: AnimeRemoveDialogProps) {
  return (
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
          <AlertDialogAction onClick={onConfirmRemove} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Rimuovi
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
