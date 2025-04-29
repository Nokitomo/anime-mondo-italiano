
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
  const scrollSnapshotRef = useRef<number | null>(null);
  const isInitialRenderRef = useRef(true);

  // Reset end reached flag when loading more data
  if (isFetching && endReachedRef.current) {
    endReachedRef.current = false;
  }

  const handleCarouselScroll = (api: CarouselApi) => {
    if (!api) return;
    
    // Save current scroll position
    const currentSnapIndex = api.selectedScrollSnap();
    scrollPositionRef.current = api.scrollSnapList()[currentSnapIndex];
    
    // Take snapshot of current position before loading more
    if (scrollSnapshotRef.current === null && hasMore && api.scrollProgress() > 0.8) {
      scrollSnapshotRef.current = currentSnapIndex;
    }
    
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
        // If we have a snapshot of where we were, use that
        if (api && api.scrollTo && scrollSnapshotRef.current !== null) {
          api.scrollTo(scrollSnapshotRef.current, false);
          // Reset the snapshot
          scrollSnapshotRef.current = null;
        }
        previousItemsCountRef.current = itemsCount;
      }, 150); // Increased timeout for more reliable DOM update
    }
  }, [itemsCount]);

  return {
    carouselApiRef,
    handleCarouselScroll,
    isInitialRenderRef,
    scrollPositionRef
  };
}
