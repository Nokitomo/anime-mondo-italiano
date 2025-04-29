
import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTrendingAnime, searchAnime } from "@/services/anilist";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { SearchBar } from "@/components/explore/SearchBar";
import { SearchResults } from "@/components/explore/SearchResults";
import { AnimeCarousel } from "@/components/explore/AnimeCarousel";
import type { AnimeMedia } from "@/types/anime";

const ITEMS_PER_PAGE = 24;

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<AnimeMedia[]>([]);
  const [isSearching, setIsSearching] = useState(false);
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
    
    setAllItems(prev => {
      // Utilizza un Set per tenere traccia degli ID già presenti
      const existingTrendingIds = new Set(prev.trending.map(anime => anime.id));
      const existingPopularIds = new Set(prev.popular.map(anime => anime.id));
      const existingUpcomingIds = new Set(prev.upcoming.map(anime => anime.id));
      
      // Filtra i nuovi dati per rimuovere quelli già presenti
      const newTrending = data.trending.media.filter(anime => !existingTrendingIds.has(anime.id));
      const newPopular = data.popular.media.filter(anime => !existingPopularIds.has(anime.id));
      const newUpcoming = data.upcoming.media.filter(anime => !existingUpcomingIds.has(anime.id));
      
      return {
        trending: page.trending === 1 ? data.trending.media : [...prev.trending, ...newTrending],
        popular: page.popular === 1 ? data.popular.media : [...prev.popular, ...newPopular],
        upcoming: page.upcoming === 1 ? data.upcoming.media : [...prev.upcoming, ...newUpcoming]
      };
    });

    // Update hasMore state based on pagination info
    setHasMore({
      trending: data.trending.pageInfo?.hasNextPage ?? false,
      popular: data.popular.pageInfo?.hasNextPage ?? false,
      upcoming: data.upcoming.pageInfo?.hasNextPage ?? false
    });
  }, [data, page]);

  const loadMoreAnime = useCallback((section: "trending" | "popular" | "upcoming") => {
    if (isFetching || !hasMore[section]) return;
    
    console.log(`Caricamento di più anime per la sezione: ${section}`);
    
    setPage(prev => ({
      ...prev,
      [section]: prev[section] + 1
    }));
  }, [isFetching, hasMore]);
  
  // Esegue la ricerca direttamente in questa pagina invece di reindirizzare
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    try {
      const response = await searchAnime(searchTerm, 1, 24);
      setSearchResults(response.Page.media);
    } catch (error) {
      console.error("Errore nella ricerca:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la ricerca.",
        variant: "destructive",
      });
    }
  };

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
      
      {/* Search input at the top of the page */}
      <SearchBar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={handleSearch}
      />

      {/* Search Results Section */}
      {isSearching && (
        <SearchResults 
          searchTerm={searchTerm}
          searchResults={searchResults}
          onClearSearch={() => {
            setIsSearching(false);
            setSearchTerm("");
          }}
        />
      )}
      
      {/* Anime sections with horizontal scrolling */}
      {!isSearching && (
        <div className="space-y-10">
          {/* Trending Section */}
          <AnimeCarousel 
            title="Anime in tendenza"
            animeList={allItems.trending}
            isLoading={isLoading}
            isFetching={isFetching}
            hasMore={hasMore.trending}
            onScrollEnd={() => loadMoreAnime("trending")}
          />
          
          {/* Popular Section */}
          <AnimeCarousel 
            title="Anime popolari"
            animeList={allItems.popular}
            isLoading={isLoading}
            isFetching={isFetching}
            hasMore={hasMore.popular}
            onScrollEnd={() => loadMoreAnime("popular")}
          />
          
          {/* Upcoming Section */}
          <AnimeCarousel 
            title="Anime in arrivo"
            animeList={allItems.upcoming}
            isLoading={isLoading}
            isFetching={isFetching}
            hasMore={hasMore.upcoming}
            onScrollEnd={() => loadMoreAnime("upcoming")}
          />
        </div>
      )}
    </div>
  );
};

export default Explore;
