import { useState, useEffect } from "react";
import { AnimeCard, AnimeCardSkeleton } from "@/components/AnimeCard";
import { useQuery } from "@tanstack/react-query";
import { getTrendingAnime } from "@/services/anilist";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import type { AnimeMedia } from "@/types/anime";

const ITEMS_PER_PAGE = 24;

const Explore = () => {
  const [page, setPage] = useState({
    trending: 1,
    popular: 1, 
    upcoming: 1
  });
  const [hasMore, setHasMore] = useState({
    trending: true,
    popular: true,
    upcoming: true
  });
  const [activeTab, setActiveTab] = useState<"trending" | "popular" | "upcoming">("trending");
  const [allItems, setAllItems] = useState<{
    trending: AnimeMedia[],
    popular: AnimeMedia[],
    upcoming: AnimeMedia[]
  }>({
    trending: [],
    popular: [],
    upcoming: []
  });
  
  const { toast } = useToast();
  
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["trendingAnime", page],
    queryFn: () => getTrendingAnime({
      trendingPage: page.trending,
      trendingPerPage: ITEMS_PER_PAGE,
      popularPage: page.popular,
      popularPerPage: ITEMS_PER_PAGE,
      upcomingPage: page.upcoming,
      upcomingPerPage: ITEMS_PER_PAGE
    }),
    staleTime: 5 * 60 * 1000,
    retry: 2,
    meta: {
      onError: (error: Error) => {
        console.error("Errore nel caricamento degli anime:", error);
        toast({
          title: "Errore",
          description: "Si è verificato un errore nel caricamento degli anime.",
          variant: "destructive",
        });
      }
    }
  });

  // Effect to add new data to existing arrays
  useEffect(() => {
    if (!data) return;
    
    setAllItems(prev => ({
      trending: page.trending === 1 ? data.trending.media : [...prev.trending, ...data.trending.media],
      popular: page.popular === 1 ? data.popular.media : [...prev.popular, ...data.popular.media],
      upcoming: page.upcoming === 1 ? data.upcoming.media : [...prev.upcoming, ...data.upcoming.media]
    }));

    // Update hasMore state based on pagination info
    setHasMore({
      trending: data.trending.pageInfo?.hasNextPage ?? false,
      popular: data.popular.pageInfo?.hasNextPage ?? false,
      upcoming: data.upcoming.pageInfo?.hasNextPage ?? false
    });
  }, [data, page]);

  const handleTabChange = (value: string) => {
    setActiveTab(value as "trending" | "popular" | "upcoming");
  };

  const loadMore = () => {
    if (isFetching) return;
    
    // Update only the page for the active tab
    setPage(prev => ({
      ...prev,
      [activeTab]: prev[activeTab] + 1
    }));
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
        <Button variant="outline" onClick={() => setPage({trending: 1, popular: 1, upcoming: 1})}>Riprova</Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Esplora</h1>
      
      <Tabs value={activeTab} className="w-full" onValueChange={handleTabChange}>
        <TabsList className="mb-6">
          <TabsTrigger value="trending">In tendenza</TabsTrigger>
          <TabsTrigger value="popular">Popolari</TabsTrigger>
          <TabsTrigger value="upcoming">In arrivo</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trending">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {allItems.trending.map((anime, index) => (
              <AnimeCard key={`trending-${anime.id}-${index}`} anime={anime} />
            ))}
          </div>
          
          {hasMore.trending && (
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
            {allItems.popular.map((anime, index) => (
              <AnimeCard key={`popular-${anime.id}-${index}`} anime={anime} />
            ))}
          </div>
          
          {hasMore.popular && (
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
        
        <TabsContent value="upcoming">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {allItems.upcoming.map((anime, index) => (
              <AnimeCard key={`upcoming-${anime.id}-${index}`} anime={anime} />
            ))}
          </div>
          
          {hasMore.upcoming && (
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
      </Tabs>
    </div>
  );
};

export default Explore;
