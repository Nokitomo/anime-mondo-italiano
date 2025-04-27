
import { useState, useMemo } from "react";
import { AnimeListItem } from "@/services/supabase-service";
import { SortOption } from "./types";

export function useAnimeListSort(animeList: AnimeListItem[], activeStatus: string) {
  const [sortBy, setSortBy] = useState<SortOption>({
    field: 'updated_at',
    direction: 'desc',
    label: 'Data aggiornamento (recente-vecchio)'
  });

  const sortedAndFilteredList = useMemo(() => {
    const filtered = animeList.filter(item => item.status === activeStatus);
    
    return [...filtered].sort((a, b) => {
      const fieldA = a[sortBy.field];
      const fieldB = b[sortBy.field];
      
      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        return sortBy.direction === 'asc' 
          ? fieldA.localeCompare(fieldB) 
          : fieldB.localeCompare(fieldA);
      }
      
      if (typeof fieldA === 'number' && typeof fieldB === 'number') {
        return sortBy.direction === 'asc' ? fieldA - fieldB : fieldB - fieldA;
      }
      
      if (sortBy.field === 'updated_at' || sortBy.field === 'created_at') {
        const dateA = new Date(String(fieldA)).getTime();
        const dateB = new Date(String(fieldB)).getTime();
        return sortBy.direction === 'asc' ? dateA - dateB : dateB - dateA;
      }
      
      return 0;
    });
  }, [animeList, activeStatus, sortBy]);

  return { sortedAndFilteredList, sortBy, setSortBy };
}
