
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getUserAnimeList, AnimeListItem, updateAnimeInList, removeAnimeFromList } from "@/services/supabase-service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { statusLabels, AnimeStatus } from "@/types/anime";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, Edit, Filter, Plus, Minus, Trash2 } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuRadioGroup, 
  DropdownMenuRadioItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

type SortOption = {
  field: keyof AnimeListItem | 'title' | 'format';
  direction: 'asc' | 'desc';
  label: string;
};

const sortOptions: SortOption[] = [
  { field: 'title', direction: 'asc', label: 'Titolo (A-Z)' },
  { field: 'title', direction: 'desc', label: 'Titolo (Z-A)' },
  { field: 'score', direction: 'desc', label: 'Voto (alto-basso)' },
  { field: 'score', direction: 'asc', label: 'Voto (basso-alto)' },
  { field: 'progress', direction: 'desc', label: 'Progresso (alto-basso)' },
  { field: 'progress', direction: 'asc', label: 'Progresso (basso-alto)' },
  { field: 'updated_at', direction: 'desc', label: 'Data aggiornamento (recente-vecchio)' },
  { field: 'updated_at', direction: 'asc', label: 'Data aggiornamento (vecchio-recente)' },
];

const AnimeList = () => {
  const { user } = useAuth();
  const [animeList, setAnimeList] = useState<AnimeListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AnimeStatus>("IN_CORSO");
  const { toast } = useToast();
  const [animeToDelete, setAnimeToDelete] = useState<AnimeListItem | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>(sortOptions[6]); // Default sort by last updated

  useEffect(() => {
    const fetchUserAnimeList = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userAnimeList = await getUserAnimeList(user.id);
        setAnimeList(userAnimeList || []);
      } catch (err) {
        console.error("Errore nel recupero della lista anime:", err);
        setError("Si è verificato un errore nel caricamento della tua lista anime.");
        toast({
          title: "Errore",
          description: "Impossibile caricare la tua lista anime.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserAnimeList();
  }, [user, toast]);

  const handleUpdateProgress = async (anime: AnimeListItem, increment: number) => {
    try {
      const newProgress = Math.max(0, anime.progress + increment);
      await updateAnimeInList(anime.id, {
        progress: newProgress,
        updated_at: new Date().toISOString(),
      });
      
      // Aggiorna lo stato locale
      setAnimeList(prevList => 
        prevList.map(item => 
          item.id === anime.id ? { ...item, progress: newProgress, updated_at: new Date().toISOString() } : item
        )
      );
      
      toast({
        title: "Aggiornato",
        description: `Progresso aggiornato a ${newProgress} episodi.`,
      });
    } catch (err) {
      console.error("Errore nell'aggiornamento del progresso:", err);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare il progresso.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAnime = async () => {
    if (!animeToDelete) return;
    
    try {
      await removeAnimeFromList(animeToDelete.id);
      
      // Aggiorna lo stato locale
      setAnimeList(prevList => prevList.filter(item => item.id !== animeToDelete.id));
      
      toast({
        title: "Eliminato",
        description: `Anime rimosso dalla lista.`,
      });
      
      setAnimeToDelete(null);
    } catch (err) {
      console.error("Errore nella rimozione dell'anime:", err);
      toast({
        title: "Errore",
        description: "Impossibile rimuovere l'anime dalla lista.",
        variant: "destructive",
      });
    }
  };

  const sortedAndFilteredList = () => {
    const filtered = animeList.filter(item => item.status === activeTab);
    
    return [...filtered].sort((a, b) => {
      const fieldA = a[sortBy.field];
      const fieldB = b[sortBy.field];
      
      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        return sortBy.direction === 'asc' 
          ? fieldA.localeCompare(fieldB) 
          : fieldB.localeCompare(fieldA);
      }
      
      if (typeof fieldA === 'number' && typeof fieldB === 'number') {
        return sortBy.direction === 'asc' ? fieldA - fieldB : fieldB - fieldA;
      }
      
      if (fieldA instanceof Date && fieldB instanceof Date) {
        return sortBy.direction === 'asc' 
          ? fieldA.getTime() - fieldB.getTime() 
          : fieldB.getTime() - fieldA.getTime();
      }
      
      // Handle dates stored as strings
      if (sortBy.field === 'updated_at' || sortBy.field === 'created_at') {
        const dateA = new Date(a[sortBy.field] as string);
        const dateB = new Date(b[sortBy.field] as string);
        return sortBy.direction === 'asc' 
          ? dateA.getTime() - dateB.getTime() 
          : dateB.getTime() - dateA.getTime();
      }
      
      return 0;
    });
  };

  if (!user) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Le mie liste</h1>
        <p className="text-lg mb-4">Accedi per visualizzare e gestire le tue liste anime.</p>
        <Button asChild>
          <Link to="/login">Accedi</Link>
        </Button>
      </div>
    );
  }

  const filteredList = sortedAndFilteredList();

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Le mie liste</h1>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4 mr-1" />
                Ordina: {sortBy.label}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuRadioGroup value={`${sortBy.field}-${sortBy.direction}`} onValueChange={(value) => {
                const [field, direction] = value.split('-') as [keyof AnimeListItem, 'asc' | 'desc'];
                const option = sortOptions.find(o => o.field === field && o.direction === direction);
                if (option) setSortBy(option);
              }}>
                {sortOptions.map((option, index) => (
                  <DropdownMenuRadioItem 
                    key={`${option.field}-${option.direction}`} 
                    value={`${option.field}-${option.direction}`}
                  >
                    {option.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button asChild variant="default">
            <Link to="/esplora">
              <Plus className="h-4 w-4 mr-1" />
              Aggiungi anime
            </Link>
          </Button>
        </div>
      </div>
      
      <Tabs
        defaultValue="IN_CORSO"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as AnimeStatus)}
        className="w-full"
      >
        <TabsList className="mb-6">
          {Object.entries(statusLabels).map(([key, label]) => (
            <TabsTrigger key={key} value={key}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {Object.keys(statusLabels).map((status) => (
          <TabsContent key={status} value={status}>
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Caricamento...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <Button variant="outline">Riprova</Button>
              </div>
            ) : filteredList.length > 0 ? (
              <div className="space-y-4">
                <Table>
                  <TableCaption>
                    La tua lista contiene {filteredList.length} anime nella categoria {statusLabels[activeTab as AnimeStatus]}.
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
                    {filteredList.map((anime) => (
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
                              onClick={() => handleUpdateProgress(anime, -1)}
                              disabled={anime.progress <= 0}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span>{anime.progress}</span>
                            <Button 
                              size="icon" 
                              variant="outline" 
                              className="h-7 w-7" 
                              onClick={() => handleUpdateProgress(anime, 1)}
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
                                  onClick={() => setAnimeToDelete(anime)}
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
                                  <Button variant="outline" onClick={() => setAnimeToDelete(null)}>
                                    Annulla
                                  </Button>
                                  <Button variant="destructive" onClick={handleDeleteAnime}>
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
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  Non hai ancora aggiunto anime a questa lista.
                </p>
                <Button asChild>
                  <Link to="/esplora">Esplora anime</Link>
                </Button>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AnimeList;
