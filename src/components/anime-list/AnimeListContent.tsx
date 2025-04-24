
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Edit, Minus, Plus, Trash2 } from "lucide-react";
import { AnimeListItem } from "@/services/supabase-service";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { statusLabels, AnimeStatus } from "@/types/anime";

interface AnimeListContentProps {
  items: AnimeListItem[];
  activeTab: AnimeStatus;
  onDeleteClick: (anime: AnimeListItem) => void;
  onProgressUpdate: (anime: AnimeListItem, increment: number) => void;
  animeToDelete: AnimeListItem | null;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
}

export function AnimeListContent({
  items,
  activeTab,
  onDeleteClick,
  onProgressUpdate,
  animeToDelete,
  onCancelDelete,
  onConfirmDelete
}: AnimeListContentProps) {
  return (
    <Table>
      <TableCaption>
        La tua lista contiene {items.length} anime nella categoria {statusLabels[activeTab]}.
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Copertina</TableHead>
          <TableHead>Titolo</TableHead>
          <TableHead>Formato</TableHead>
          <TableHead>Progresso</TableHead>
          <TableHead>Voto</TableHead>
          <TableHead className="text-right">Azioni</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((anime) => (
          <TableRow key={anime.id}>
            <TableCell>
              <Link to={`/anime/${anime.anime_id}`}>
                <img 
                  src={anime.cover_image || "/placeholder.svg"} 
                  alt={anime.title || `Anime #${anime.anime_id}`} 
                  className="w-16 h-24 object-cover rounded"
                />
              </Link>
            </TableCell>
            <TableCell className="font-medium">
              <Link to={`/anime/${anime.anime_id}`} className="hover:underline">
                {anime.title || `Anime #${anime.anime_id}`}
              </Link>
            </TableCell>
            <TableCell>{anime.format || "N/A"}</TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="h-7 w-7" 
                  onClick={() => onProgressUpdate(anime, -1)}
                  disabled={anime.progress <= 0}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span>{anime.progress}</span>
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="h-7 w-7" 
                  onClick={() => onProgressUpdate(anime, 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </TableCell>
            <TableCell>{anime.score > 0 ? `${anime.score}/10` : "—"}</TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end space-x-2">
                <Button variant="ghost" size="icon" asChild>
                  <Link to={`/anime/${anime.anime_id}`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => onDeleteClick(anime)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Conferma eliminazione</DialogTitle>
                    </DialogHeader>
                    <p className="py-4">
                      Sei sicuro di voler rimuovere <strong>{animeToDelete?.title || 'questo anime'}</strong> dalla tua lista?
                      Questa azione non può essere annullata.
                    </p>
                    <DialogFooter>
                      <Button variant="outline" onClick={onCancelDelete}>
                        Annulla
                      </Button>
                      <Button variant="destructive" onClick={onConfirmDelete}>
                        Elimina
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
