
import type { AnimeMedia } from "./media";

export interface AnimeSearchResponse {
  Page: {
    pageInfo: {
      total: number;
      currentPage: number;
      lastPage: number;
      hasNextPage: boolean;
      perPage: number;
    };
    media: AnimeMedia[];
  };
}

export interface TrendingAnimeResponse {
  trending: {
    media: AnimeMedia[];
  };
  popular: {
    media: AnimeMedia[];
  };
  upcoming: {
    media: AnimeMedia[];
  };
}

export interface AnimeDetailsResponse {
  Media: AnimeMedia;
}
