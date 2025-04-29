
import { useRef, useEffect } from "react";
import { AnimeMedia } from "@/types/anime";
import { AnimeCard, AnimeCardSkeleton } from "@/components/AnimeCard";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";

interface AnimeCarouselProps {
  title: string;
  animeList: AnimeMedia[];
  isLoading: boolean;
  isFetching: boolean;
  hasMore: boolean;
  onScrollEnd: () => void;
}

export const AnimeCarousel = ({ 
  title, 
  animeList,
  isLoading, 
  isFetching, 
  hasMore,
  onScrollEnd 
}: AnimeCarouselProps) => {
  const isMobile = useIsMobile();
  const endReachedRef = useRef(false);
  const carouselApiRef = useRef<any>(null);
  const previousItemsCountRef = useRef(animeList.length);
  const scrollPositionRef = useRef(0);
  const isInitialRenderRef = useRef(true);

  const handleCarouselScroll = (api: any) => {
    if (!api) return;
    
    // Salva la posizione di scorrimento corrente
    scrollPositionRef.current = api.scrollSnapList()[api.selectedScrollSnap()];
    
    // Check if we're close to the end of the carousel (last 20% of the scroll)
    const scrollProgress = api.scrollProgress();
    
    if (scrollProgress > 0.8 && !endReachedRef.current && hasMore) {
      endReachedRef.current = true;
      onScrollEnd();
    }
  };

  // Reset end reached flag when loading more data
  if (isFetching && endReachedRef.current) {
    endReachedRef.current = false;
  }

  // Effetto per ripristinare la posizione di scorrimento quando vengono aggiunti nuovi elementi
  useEffect(() => {
    // Salta il ripristino della posizione al primo render
    if (isInitialRenderRef.current) {
      isInitialRenderRef.current = false;
      return;
    }
    
    // Ripristina la posizione solo se sono stati aggiunti nuovi elementi
    if (carouselApiRef.current && animeList.length > previousItemsCountRef.current) {
      // Aspetta che il DOM si aggiorni
      setTimeout(() => {
        const api = carouselApiRef.current;
        // Cerca di mantenere la stessa posizione visiva
        if (api && api.scrollTo) {
          api.scrollTo(scrollPositionRef.current, false);
        }
        previousItemsCountRef.current = animeList.length;
      }, 100);
    }
  }, [animeList.length]);

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
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
            dragFree: true,
            containScroll: "keepSnaps"
          }}
          setApi={(api) => {
            carouselApiRef.current = api;
            api?.on("scroll", () => {
              handleCarouselScroll(api);
            });
            
            // Quando l'API del carosello è pronta e non è il primo render
            if (!isInitialRenderRef.current && scrollPositionRef.current > 0) {
              // Attendiamo che il DOM sia pronto
              setTimeout(() => {
                api?.scrollTo(scrollPositionRef.current, false);
              }, 100);
            }
          }}
        >
          <CarouselContent>
            {animeList.map((anime, index) => (
              <CarouselItem 
                key={`${title.toLowerCase().replace(/\s+/g, '-')}-${anime.id}-${index}`} 
                className="basis-1/3 md:basis-1/3 lg:basis-1/3"
              >
                <div className="p-1">
                  <AnimeCard anime={anime} />
                </div>
              </CarouselItem>
            ))}
            {isFetching && hasMore && (
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
      )}
      
      {!hasMore && animeList.length > 0 && (
        <p className="text-center text-sm text-muted-foreground mt-2">
          Hai visto tutti gli anime {title.toLowerCase()}
        </p>
      )}
    </section>
  );
};
