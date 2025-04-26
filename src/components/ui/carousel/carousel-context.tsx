
import * as React from "react"
import { type CarouselApi } from "@/hooks/use-carousel"

interface CarouselContextProps {
  carouselRef: React.RefObject<HTMLDivElement> | React.MutableRefObject<HTMLDivElement | null>
  api: CarouselApi
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
  orientation?: "horizontal" | "vertical"
}

export const CarouselContext = React.createContext<CarouselContextProps | null>(null)

export function useCarouselContext() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}
