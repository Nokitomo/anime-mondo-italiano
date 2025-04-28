
import { queryAnilistAPI } from './client';
import { ANIME_TRENDING_QUERY } from './constants';
import type { TrendingAnimeResponse } from '@/types/anime';

export const getTrendingAnime = async (): Promise<TrendingAnimeResponse> => {
  return queryAnilistAPI<TrendingAnimeResponse>(ANIME_TRENDING_QUERY);
};
