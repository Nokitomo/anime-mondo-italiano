
import { queryAnilistAPI } from './client';
import { ANIME_TRENDING_QUERY } from './constants';
import type { TrendingAnimeResponse } from '@/types/anime';

interface TrendingAnimeOptions {
  trendingPage?: number;
  trendingPerPage?: number;
  popularPage?: number;
  popularPerPage?: number;
  upcomingPage?: number;
  upcomingPerPage?: number;
}

export const getTrendingAnime = async (options: TrendingAnimeOptions = {}): Promise<TrendingAnimeResponse> => {
  const variables = {
    trendingPage: options.trendingPage || 1,
    trendingPerPage: options.trendingPerPage || 20, // Default a 20 invece di 6
    popularPage: options.popularPage || 1,
    popularPerPage: options.popularPerPage || 20, // Default a 20 invece di 6
    upcomingPage: options.upcomingPage || 1,
    upcomingPerPage: options.upcomingPerPage || 20, // Default a 20 invece di 6
  };
  
  const response = await queryAnilistAPI<TrendingAnimeResponse>(ANIME_TRENDING_QUERY, variables);
  return response;
};
