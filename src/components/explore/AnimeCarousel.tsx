
import { AnimeMedia } from "@/types/anime";
import { AnimeCardSkeleton } from "@/components/AnimeCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAnimeCarousel } from "@/hooks/use-anime-carousel";
import { AnimeCarouselItem, AnimeCarouselLoadingItem } from "./AnimeCarouselItem";
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
  const { 
    carouselApiRef, 
    handleCarouselScroll, 
    isInitialRenderRef, 
    scrollPositionRef 
  } = useAnimeCarousel({
    itemsCount: animeList.length,
    hasMore,
    onScrollEnd,
    isFetching
  });

  // Loading skeleton display
  if (isLoading) {
    return (
      <section>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {Array(3).fill(0).map((_, i) => (
            <AnimeCardSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <Carousel
        className="w-full"
        opts={{
          align: "start",
          dragFree: true,
          containScroll: "keepSnaps"
        }}
        setApi={(api) => {
          carouselApiRef.current = api;
          
          // Set up scroll event listener
          api?.on("scroll", () => {
            handleCarouselScroll(api);
          });
          
          // Handle position restoration for non-initial renders
          if (!isInitialRenderRef.current && scrollPositionRef.current > 0) {
            // Use an increased timeout to ensure DOM is ready
            setTimeout(() => {
              if (api?.scrollTo) {
                api.scrollTo(scrollPositionRef.current, false);
              }
            }, 150);
          }
        }}
      >
        <CarouselContent>
          {animeList.map((anime, index) => (
            <AnimeCarouselItem 
              key={`${anime.id}-${index}`}
              anime={anime} 
              sectionTitle={title} 
              index={index} 
            />
          ))}
          {isFetching && hasMore && <AnimeCarouselLoadingItem />}
        </CarouselContent>
        {!isMobile && (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        )}
      </Carousel>
      
      {!hasMore && animeList.length > 0 && (
        <p className="text-center text-sm text-muted-foreground mt-2">
          Hai visto tutti gli anime {title.toLowerCase()}
        </p>
      )}
    </section>
  );
};
