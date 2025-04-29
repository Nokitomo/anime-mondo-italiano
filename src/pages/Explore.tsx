
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTrendingAnime, searchAnime } from "@/services/anilist";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { SearchBar } from "@/components/explore/SearchBar";
import { SearchResults } from "@/components/explore/SearchResults";
import { AnimeCarousel } from "@/components/explore/AnimeCarousel";
import type { AnimeMedia } from "@/types/anime";

const ITEMS_PER_PAGE = 20;

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<AnimeMedia[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const { toast } = useToast();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["trendingAnime"],
    queryFn: () => getTrendingAnime({
      trendingPage: 1,
      trendingPerPage: ITEMS_PER_PAGE,
      popularPage: 1,
      popularPerPage: ITEMS_PER_PAGE,
      upcomingPage: 1,
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
        <Button variant="outline">Riprova</Button>
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
            animeList={data?.trending.media || []}
            isLoading={isLoading}
            isFetching={false}
            hasMore={false}
            onScrollEnd={() => {}}
          />
          
          {/* Popular Section */}
          <AnimeCarousel 
            title="Anime popolari"
            animeList={data?.popular.media || []}
            isLoading={isLoading}
            isFetching={false}
            hasMore={false}
            onScrollEnd={() => {}}
          />
          
          {/* Upcoming Section */}
          <AnimeCarousel 
            title="Anime in arrivo"
            animeList={data?.upcoming.media || []}
            isLoading={isLoading}
            isFetching={false}
            hasMore={false}
            onScrollEnd={() => {}}
          />
        </div>
      )}
    </div>
  );
};

export default Explore;
