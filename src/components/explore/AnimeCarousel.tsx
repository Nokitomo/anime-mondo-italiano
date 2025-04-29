
import { useRef } from "react";
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

  const handleCarouselScroll = (api: any) => {
    if (!api) return;
    
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
            dragFree: true
          }}
          setApi={(api) => {
            api?.on("scroll", () => {
              handleCarouselScroll(api);
            });
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
