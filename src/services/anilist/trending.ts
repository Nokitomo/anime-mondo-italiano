
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
    trendingPerPage: options.trendingPerPage || 20,
    popularPage: options.popularPage || 1,
    popularPerPage: options.popularPerPage || 20,
    upcomingPage: options.upcomingPage || 1,
    upcomingPerPage: options.upcomingPerPage || 20,
  };
  
  const response = await queryAnilistAPI<TrendingAnimeResponse>(ANIME_TRENDING_QUERY, variables);
  
  // Ensure no duplicate entries by creating a unique set based on ID
  const uniqueTrending = removeDuplicates(response.trending.media);
  const uniquePopular = removeDuplicates(response.popular.media);
  const uniqueUpcoming = removeDuplicates(response.upcoming.media);
  
  return {
    trending: {
      ...response.trending,
      media: uniqueTrending
    },
    popular: {
      ...response.popular,
      media: uniquePopular
    },
    upcoming: {
      ...response.upcoming,
      media: uniqueUpcoming
    }
  };
};

// Helper function to remove duplicates based on anime ID
function removeDuplicates(animeList: any[]): any[] {
  const uniqueIds = new Set();
  return animeList.filter(anime => {
    if (uniqueIds.has(anime.id)) {
      return false;
    }
    uniqueIds.add(anime.id);
    return true;
  });
}
