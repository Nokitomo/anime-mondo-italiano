
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getUserAnimeList, AnimeListItem, updateAnimeInList, removeAnimeFromList } from "@/services/supabase-service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { statusLabels, AnimeStatus } from "@/types/anime";
import { toast } from "@/hooks/use-toast";
import { AnimeListHeader } from "@/components/anime-list/AnimeListHeader";
import { AnimeListContent } from "@/components/anime-list/AnimeListContent";
import { AnimeListEmpty } from "@/components/anime-list/AnimeListEmpty";
import { LoginPrompt } from "@/components/anime-list/LoginPrompt";
import { useAnimeListSort } from "@/components/anime-list/useAnimeListSort";
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
  const [animeToDelete, setAnimeToDelete] = useState<AnimeListItem | null>(null);
  const { sortedAndFilteredList, sortBy, setSortBy } = useAnimeListSort(animeList, activeTab);

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
        toast("Errore", {
          description: "Impossibile caricare la tua lista anime.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserAnimeList();
  }, [user]);

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
      
      toast("Aggiornato", {
        description: `Progresso aggiornato a ${newProgress} episodi.`
      });
    } catch (err) {
      console.error("Errore nell'aggiornamento del progresso:", err);
      toast("Errore", {
        description: "Impossibile aggiornare il progresso.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAnime = async () => {
    if (!animeToDelete) return;
    
    try {
      await removeAnimeFromList(animeToDelete.id);
      setAnimeList(prevList => prevList.filter(item => item.id !== animeToDelete.id));
      toast("Eliminato", {
        description: `Anime rimosso dalla lista.`
      });
      setAnimeToDelete(null);
    } catch (err) {
      console.error("Errore nella rimozione dell'anime:", err);
      toast("Errore", {
        description: "Impossibile rimuovere l'anime dalla lista.",
        variant: "destructive"
      });
    }
  };

  if (!user) {
    return <LoginPrompt />;
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
              </div>
            ) : sortedAndFilteredList.length > 0 ? (
              <AnimeListContent
                items={sortedAndFilteredList}
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
