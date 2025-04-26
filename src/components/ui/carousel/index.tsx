import * as React from "react"
import { cn } from "@/lib/utils"

import { useCarousel } from "@/hooks/use-carousel"
import { CarouselContext } from "./carousel-context"
import { CarouselContent } from "./carousel-content"
import { CarouselItem } from "./carousel-item"
import { CarouselNext, CarouselPrevious } from "./carousel-navigation"

import type { UseCarouselProps, CarouselApi } from "@/hooks/use-carousel"

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & UseCarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const {
      carouselRef,
      api,
      orientation: _orientation,
      scrollPrev,
      scrollNext,
      canScrollPrev,
      canScrollNext,
      handleKeyDown,
    } = useCarousel({
      opts,
      orientation,
      setApi,
      plugins,
    })

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api,
          orientation: _orientation,
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  }
)

Carousel.displayName = "Carousel"

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}