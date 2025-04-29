
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
  
  // Less restrictive filter for upcoming anime to ensure we get enough results
  const now = new Date();
  const uniqueUpcoming = removeDuplicates(response.upcoming.media).filter(anime => {
    // Include anime with future episodes
    if (anime.nextAiringEpisode) {
      return true;
    }
    
    // Include anime with NOT_YET_RELEASED status
    if (anime.status === "NOT_YET_RELEASED") {
      return true;
    }
    
    // Include anime with future start dates if available
    if (anime.startDate && anime.startDate.year) {
      // Only filter by year if it's this year or future
      if (anime.startDate.year > now.getFullYear()) {
        return true;
      }
      
      // For same year, check if month/day is in future if available
      if (anime.startDate.year === now.getFullYear()) {
        // If month is specified and is future
        if (anime.startDate.month && anime.startDate.month > (now.getMonth() + 1)) {
          return true;
        }
        
        // If month is current month but day is in future
        if (anime.startDate.month === (now.getMonth() + 1) && 
            anime.startDate.day && anime.startDate.day >= now.getDate()) {
          return true;
        }
      }
    }
    
    return false;
  });
  
  // Limit to exactly 20 items per section if more are returned
  return {
    trending: {
      ...response.trending,
      media: uniqueTrending.slice(0, 20)
    },
    popular: {
      ...response.popular,
      media: uniquePopular.slice(0, 20)
    },
    upcoming: {
      ...response.upcoming,
      media: uniqueUpcoming.slice(0, 20)
    }
  };
};

// Helper function to remove duplicates based on anime ID
function removeDuplicates(animeList: any[]): any[] {
  const uniqueIds = new Set();
  return animeList.filter(anime => {
    if (!anime || !anime.id || uniqueIds.has(anime.id)) {
      return false;
    }
    uniqueIds.add(anime.id);
    return true;
  });
}
