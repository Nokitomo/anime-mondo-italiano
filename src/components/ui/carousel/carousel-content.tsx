import * as React from "react"
import type { CarouselApi, CarouselViewportRef } from "@/hooks/use-carousel"

interface CarouselContextProps {
  // callback ref fornito da Embla
  carouselRef: CarouselViewportRef
  api: CarouselApi
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
  orientation?: "horizontal" | "vertical"
}

export const CarouselContext = React.createContext<CarouselContextProps | null>(null)

export function useCarouselContext(): CarouselContextProps {
  const context = React.useContext(CarouselContext)
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }
  return context
}