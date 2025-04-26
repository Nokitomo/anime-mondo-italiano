import * as React from "react"
import { cn } from "@/lib/utils"
import { useCarouselContext } from "./carousel-context"

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarouselContext()

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        // width fissa al 20% del contenitore, per mostrarne 5 in viewport
        "min-w-0 shrink-0 grow-0 w-1/5",
        // padding laterale o verticale a seconda dell'orientamento
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  )
})

CarouselItem.displayName = "CarouselItem"

export { CarouselItem }