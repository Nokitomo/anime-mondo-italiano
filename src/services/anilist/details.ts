
import { queryAnilistAPI } from './client';
import { ANIME_DETAILS_QUERY } from './constants';
import type { AnimeDetailsResponse } from '@/types/anime';

export const getAnimeDetails = async (id: number): Promise<AnimeDetailsResponse> => {
  return queryAnilistAPI<AnimeDetailsResponse>(ANIME_DETAILS_QUERY, { id });
};
