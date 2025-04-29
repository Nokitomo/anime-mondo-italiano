
import { useState, useEffect, useRef } from "react";
import { AnimeCard, AnimeCardSkeleton } from "@/components/AnimeCard";
import { useQuery } from "@tanstack/react-query";
import { getTrendingAnime, searchAnime } from "@/services/anilist";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { useNavigate } from "react-router-dom";
import type { AnimeMedia } from "@/types/anime";

const ITEMS_PER_PAGE = 24;

const Explore = () => {
  const navigate = useNavigate();
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
  const isMobile = useIsMobile();
  
  // Tracking carousel end reach for auto-loading more content
  const trendingEndReached = useRef(false);
  const popularEndReached = useRef(false);
  const upcomingEndReached = useRef(false);
  
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
    
    // Reset end reached flags after loading more data
    trendingEndReached.current = false;
    popularEndReached.current = false;
    upcomingEndReached.current = false;
  }, [data, page]);

  const loadMoreAnime = (section: "trending" | "popular" | "upcoming") => {
    if (isFetching || !hasMore[section]) return;
    
    setPage(prev => ({
      ...prev,
      [section]: prev[section] + 1
    }));
  };
  
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

  const handleCarouselScroll = (section: "trending" | "popular" | "upcoming", api: any) => {
    if (!api) return;
    
    // Check if we're close to the end of the carousel (last 20% of the scroll)
    const scrollProgress = api.scrollProgress();
    
    if (scrollProgress > 0.8) {
      if (section === "trending" && !trendingEndReached.current && hasMore.trending) {
        trendingEndReached.current = true;
        loadMoreAnime("trending");
      } else if (section === "popular" && !popularEndReached.current && hasMore.popular) {
        popularEndReached.current = true;
        loadMoreAnime("popular");
      } else if (section === "upcoming" && !upcomingEndReached.current && hasMore.upcoming) {
        upcomingEndReached.current = true;
        loadMoreAnime("upcoming");
      }
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
      <div className="mb-8">
        <div className="relative">
          <Input
            placeholder="Cerca anime e manga..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-0 top-0 h-full"
            onClick={handleSearch}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search Results Section */}
      {isSearching && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Risultati per "{searchTerm}"</h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setIsSearching(false);
                setSearchTerm("");
              }}
            >
              Torna all'esplorazione
            </Button>
          </div>
          
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {searchResults.map((anime) => (
                <AnimeCard key={`search-${anime.id}`} anime={anime} />
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-muted-foreground">Nessun risultato trovato per "{searchTerm}"</p>
          )}
        </section>
      )}
      
      {/* Anime sections with horizontal scrolling */}
      {!isSearching && (
        <div className="space-y-10">
          {/* Trending Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Anime in tendenza</h2>
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {Array(3).fill(0).map((_, i) => (
                  <AnimeCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <Carousel
                className="w-full"
                opts={{
                  align: "start",
                  dragFree: true
                }}
                setApi={(api) => {
                  api?.on("scroll", () => {
                    handleCarouselScroll("trending", api);
                  });
                }}
              >
                <CarouselContent>
                  {allItems.trending.map((anime, index) => (
                    <CarouselItem key={`trending-${anime.id}-${index}`} className="basis-1/3 md:basis-1/3 lg:basis-1/3">
                      <div className="p-1">
                        <AnimeCard anime={anime} />
                      </div>
                    </CarouselItem>
                  ))}
                  {isFetching && hasMore.trending && (
                    <CarouselItem className="basis-1/3 md:basis-1/3 lg:basis-1/3">
                      <div className="p-1">
                        <AnimeCardSkeleton />
                      </div>
                    </CarouselItem>
                  )}
                </CarouselContent>
                {!isMobile && (
                  <>
                    <CarouselPrevious />
                    <CarouselNext />
                  </>
                )}
              </Carousel>
              
              {!hasMore.trending && allItems.trending.length > 0 && (
                <p className="text-center text-sm text-muted-foreground mt-2">
                  Hai visto tutti gli anime in tendenza
                </p>
              )}
            )}
          </section>
          
          {/* Popular Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Anime popolari</h2>
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {Array(3).fill(0).map((_, i) => (
                  <AnimeCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <Carousel
                className="w-full"
                opts={{
                  align: "start",
                  dragFree: true
                }}
                setApi={(api) => {
                  api?.on("scroll", () => {
                    handleCarouselScroll("popular", api);
                  });
                }}
              >
                <CarouselContent>
                  {allItems.popular.map((anime, index) => (
                    <CarouselItem key={`popular-${anime.id}-${index}`} className="basis-1/3 md:basis-1/3 lg:basis-1/3">
                      <div className="p-1">
                        <AnimeCard anime={anime} />
                      </div>
                    </CarouselItem>
                  ))}
                  {isFetching && hasMore.popular && (
                    <CarouselItem className="basis-1/3 md:basis-1/3 lg:basis-1/3">
                      <div className="p-1">
                        <AnimeCardSkeleton />
                      </div>
                    </CarouselItem>
                  )}
                </CarouselContent>
                {!isMobile && (
                  <>
                    <CarouselPrevious />
                    <CarouselNext />
                  </>
                )}
              </Carousel>
              
              {!hasMore.popular && allItems.popular.length > 0 && (
                <p className="text-center text-sm text-muted-foreground mt-2">
                  Hai visto tutti gli anime popolari
                </p>
              )}
            )}
          </section>
          
          {/* Upcoming Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Anime in arrivo</h2>
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {Array(3).fill(0).map((_, i) => (
                  <AnimeCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <Carousel
                className="w-full"
                opts={{
                  align: "start",
                  dragFree: true
                }}
                setApi={(api) => {
                  api?.on("scroll", () => {
                    handleCarouselScroll("upcoming", api);
                  });
                }}
              >
                <CarouselContent>
                  {allItems.upcoming.map((anime, index) => (
                    <CarouselItem key={`upcoming-${anime.id}-${index}`} className="basis-1/3 md:basis-1/3 lg:basis-1/3">
                      <div className="p-1">
                        <AnimeCard anime={anime} />
                      </div>
                    </CarouselItem>
                  ))}
                  {isFetching && hasMore.upcoming && (
                    <CarouselItem className="basis-1/3 md:basis-1/3 lg:basis-1/3">
                      <div className="p-1">
                        <AnimeCardSkeleton />
                      </div>
                    </CarouselItem>
                  )}
                </CarouselContent>
                {!isMobile && (
                  <>
                    <CarouselPrevious />
                    <CarouselNext />
                  </>
                )}
              </Carousel>
              
              {!hasMore.upcoming && allItems.upcoming.length > 0 && (
                <p className="text-center text-sm text-muted-foreground mt-2">
                  Hai visto tutti gli anime in arrivo
                </p>
              )}
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default Explore;
