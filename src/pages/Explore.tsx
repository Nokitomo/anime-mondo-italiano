import { useState } from "react";
import { AnimeCard, AnimeCardSkeleton } from "@/components/AnimeCard";
import { useQuery } from "@tanstack/react-query";
import { getTrendingAnime } from "@/services/anilist-api";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Explore = () => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["trendingAnime", page],
    queryFn: () => getTrendingAnime(),
    staleTime: 5 * 60 * 1000, // 5 minuti
  });

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

  const { trending, popular, upcoming } = data.data;
  
  // Verifica se ci sono ancora anime da caricare
  if (trending.media.length < 24) {
    setHasMore(false);
  }

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
            {trending.media.map((anime) => (
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
            {popular.media.map((anime) => (
              <AnimeCard key={`popular-${anime.id}`} anime={anime} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="upcoming">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {upcoming.media.map((anime) => (
              <AnimeCard key={`upcoming-${anime.id}`} anime={anime} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Explore;
