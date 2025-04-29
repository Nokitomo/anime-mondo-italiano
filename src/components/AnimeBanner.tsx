
import { AnimeMedia } from "@/types/anime";
import { AnimeBannerContainer } from "./anime/banner/AnimeBannerContainer";

interface AnimeBannerProps {
  anime: AnimeMedia;
}

export function AnimeBanner({ anime }: AnimeBannerProps) {
  return <AnimeBannerContainer anime={anime} />;
}
