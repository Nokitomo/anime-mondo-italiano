
import { useState, useEffect } from "react";
import { AnimeCard, AnimeCardSkeleton } from "@/components/AnimeCard";
import { useQuery } from "@tanstack/react-query";
import { getTrendingAnime } from "@/services/anilist-api";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const Explore = () => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();
  
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["trendingAnime", page],
    queryFn: () => getTrendingAnime(),
    staleTime: 5 * 60 * 1000,
    retry: 2,
    meta: {
      onError: (err: any) => {
        console.error("Errore nel caricamento degli anime:", err);
        toast({
          title: "Errore",
          description: "Si è verificato un errore nel caricamento degli anime.",
          variant: "destructive",
        });
      }
    }
  });

  // Effetto per gestire hasMore quando i dati cambiano
  useEffect(() => {
    if (data?.data?.trending?.media) {
      setHasMore(data.data.trending.media.length >= 24);
    }
  }, [data]);

  const loadMore = () => {
    if (!isFetching && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Esplora</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array(24).fill(0).map((_, i) => (
            <AnimeCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Esplora</h1>
        <p className="text-red-600 mb-4">Si è verificato un errore nel caricamento degli anime.</p>
        <Button variant="outline" onClick={() => setPage(1)}>Riprova</Button>
      </div>
    );
  }

  // Sicurezza per evitare riferimenti a dati undefined
  const trending = data?.data?.trending?.media || [];
  const popular = data?.data?.popular?.media || [];
  const upcoming = data?.data?.upcoming?.media || [];

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Esplora</h1>
      
      <Tabs defaultValue="trending" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="trending">In tendenza</TabsTrigger>
          <TabsTrigger value="popular">Popolari</TabsTrigger>
          <TabsTrigger value="upcoming">In arrivo</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trending">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {trending.map((anime) => (
              <AnimeCard key={`trending-${anime.id}`} anime={anime} />
            ))}
          </div>
          
          {hasMore && (
            <div className="flex justify-center mt-8">
              <Button 
                onClick={loadMore}
                disabled={isFetching}
                variant="outline"
                className="min-w-[200px]"
              >
                {isFetching ? "Caricamento..." : "Carica altri anime"}
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="popular">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {popular.map((anime) => (
              <AnimeCard key={`popular-${anime.id}`} anime={anime} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="upcoming">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {upcoming.map((anime) => (
              <AnimeCard key={`upcoming-${anime.id}`} anime={anime} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Explore;
