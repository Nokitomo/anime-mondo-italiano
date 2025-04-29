
import React from "react";
import { AnimeMedia } from "@/types/anime";
import { AnimeCard, AnimeCardSkeleton } from "@/components/AnimeCard";
import { CarouselItem } from "@/components/ui/carousel";

interface AnimeCarouselItemProps {
  anime: AnimeMedia;
  sectionTitle: string;
  index: number;
}

export const AnimeCarouselItem = React.memo(
  function AnimeCarouselItem({ anime, sectionTitle, index }: AnimeCarouselItemProps) {
    return (
      <CarouselItem 
        className="basis-1/3 md:basis-1/3 lg:basis-1/3"
      >
        <div className="p-1">
          <AnimeCard anime={anime} />
        </div>
      </CarouselItem>
    );
  }
);

export function AnimeCarouselLoadingItem() {
  return (
    <CarouselItem className="basis-1/3 md:basis-1/3 lg:basis-1/3">
      <div className="p-1">
        <AnimeCardSkeleton />
      </div>
    </CarouselItem>
  );
}
