
import { AnimeListItem } from "@/services/supabase-service";

export type SortOption = {
  field: keyof AnimeListItem | 'title' | 'format';
  direction: 'asc' | 'desc';
  label: string;
};
