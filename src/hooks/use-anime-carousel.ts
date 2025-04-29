
import { useRef, useEffect } from "react";
import type { CarouselApi } from "@/hooks/use-carousel";

interface UseAnimeCarouselProps {
  itemsCount: number;
  hasMore: boolean;
  onScrollEnd: () => void;
  isFetching: boolean;
}

export function useAnimeCarousel({ 
  itemsCount,
  hasMore,
  onScrollEnd,
  isFetching
}: UseAnimeCarouselProps) {
  const endReachedRef = useRef(false);
  const carouselApiRef = useRef<CarouselApi | null>(null);
  const previousItemsCountRef = useRef(itemsCount);
  const scrollPositionRef = useRef(0);
  const isInitialRenderRef = useRef(true);

  // Reset end reached flag when loading more data
  if (isFetching && endReachedRef.current) {
    endReachedRef.current = false;
  }

  const handleCarouselScroll = (api: CarouselApi) => {
    if (!api) return;
    
    // Save current scroll position
    scrollPositionRef.current = api.scrollSnapList()[api.selectedScrollSnap()];
    
    // Check if we're close to the end of the carousel (last 20% of the scroll)
    const scrollProgress = api.scrollProgress();
    
    if (scrollProgress > 0.8 && !endReachedRef.current && hasMore) {
      endReachedRef.current = true;
      onScrollEnd();
    }
  };

  // Effect to restore scroll position when new items are added
  useEffect(() => {
    // Skip restoration on first render
    if (isInitialRenderRef.current) {
      isInitialRenderRef.current = false;
      return;
    }
    
    // Restore position only if new items were added
    if (carouselApiRef.current && itemsCount > previousItemsCountRef.current) {
      // Wait for DOM to update
      setTimeout(() => {
        const api = carouselApiRef.current;
        // Try to maintain the same visual position
        if (api && api.scrollTo) {
          api.scrollTo(scrollPositionRef.current, false);
        }
        previousItemsCountRef.current = itemsCount;
      }, 100);
    }
  }, [itemsCount]);

  return {
    carouselApiRef,
    handleCarouselScroll,
    isInitialRenderRef,
    scrollPositionRef
  };
}
