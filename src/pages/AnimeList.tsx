
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getUserAnimeList, AnimeListItem } from "@/services/supabase-service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { statusLabels, AnimeStatus } from "@/types/anime";
import { useToast } from "@/hooks/use-toast";

const AnimeList = () => {
  const { user } = useAuth();
  const [animeList, setAnimeList] = useState<AnimeListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AnimeStatus>("IN_CORSO");
  const { toast } = useToast();

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
  }, [user]);

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

  const filteredList = animeList.filter(item => item.status === activeTab);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Le mie liste</h1>
      
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
                {/* Una tabella verrà implementata qui in futuro */}
                <p className="text-center py-8">
                  La lista contiene {filteredList.length} anime nella categoria {statusLabels[activeTab as AnimeStatus]}.
                </p>
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
