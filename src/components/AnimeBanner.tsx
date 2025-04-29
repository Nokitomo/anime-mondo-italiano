
import { AnimeMedia } from "@/types/anime";
import { AnimeBannerContainer } from "./anime/banner/AnimeBannerContainer";
import { AnimeListItem } from "@/services/supabase-service";

interface AnimeBannerProps {
  anime: AnimeMedia;
  onUpdateNotes?: (anime: AnimeListItem) => void;
}

export function AnimeBanner({ anime, onUpdateNotes }: AnimeBannerProps) {
  return <AnimeBannerContainer anime={anime} onUpdateNotes={onUpdateNotes} />;
}
