
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getUserAnimeList, AnimeListItem, updateAnimeInList, removeAnimeFromList } from "@/services/supabase-service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { statusLabels, AnimeStatus } from "@/types/anime";
import { useToast } from "@/hooks/use-toast";
import { AnimeListHeader } from "@/components/anime-list/AnimeListHeader";
import { AnimeListContent } from "@/components/anime-list/AnimeListContent";
import { AnimeListEmpty } from "@/components/anime-list/AnimeListEmpty";
import { SortOption } from "@/components/anime-list/types";

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
  const [sortBy, setSortBy] = useState<SortOption>(sortOptions[6]);

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
      
      // Handle date strings
      if (sortBy.field === 'updated_at' || sortBy.field === 'created_at') {
        const dateA = new Date(String(fieldA)).getTime();
        const dateB = new Date(String(fieldB)).getTime();
        return sortBy.direction === 'asc' ? dateA - dateB : dateB - dateA;
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

  return (
    <div className="container py-8">
      <AnimeListHeader 
        sortBy={sortBy} 
        onSortChange={setSortBy} 
        sortOptions={sortOptions}
      />
      
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
            ) : sortedAndFilteredList().length > 0 ? (
              <AnimeListContent
                items={sortedAndFilteredList()}
                activeTab={activeTab as AnimeStatus}
                onDeleteClick={setAnimeToDelete}
                onProgressUpdate={handleUpdateProgress}
                animeToDelete={animeToDelete}
                onCancelDelete={() => setAnimeToDelete(null)}
                onConfirmDelete={handleDeleteAnime}
              />
            ) : (
              <AnimeListEmpty />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AnimeList;
