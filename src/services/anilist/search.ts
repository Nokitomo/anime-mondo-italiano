
import { queryAnilistAPI } from './client';
import { ANIME_SEARCH_QUERY } from './constants';
import type { AnimeSearchResponse } from '@/types/anime';

export const searchAnime = async (
  search: string,
  page = 1,
  perPage = 20,
  type: "ANIME" | "MANGA" = "ANIME"
): Promise<AnimeSearchResponse> => {
  const response = await queryAnilistAPI<AnimeSearchResponse>(ANIME_SEARCH_QUERY, {
    search,
    page,
    perPage,
    type,
  });
  return response;
};
