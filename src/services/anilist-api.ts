
import { AnimeSearchResponse, TrendingAnimeResponse } from "@/types/anime";

const ANILIST_API_URL = "https://graphql.anilist.co";

const searchQuery = `
  query ($search: String, $page: Int, $perPage: Int, $type: MediaType) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media(search: $search, type: $type, sort: POPULARITY_DESC) {
        id
        title {
          romaji
          english
          native
          userPreferred
        }
        coverImage {
          large
          medium
        }
        bannerImage
        description
        episodes
        chapters
        genres
        averageScore
        meanScore
        format
        status
        season
        seasonYear
        startDate {
          year
          month
          day
        }
        endDate {
          year
          month
          day
        }
        studios(isMain: true) {
          nodes {
            id
            name
          }
        }
        type
      }
    }
  }
`;

const trendingQuery = `
  query {
    trending: Page(page: 1, perPage: 6) {
      media(sort: TRENDING_DESC, type: ANIME) {
        id
        title {
          romaji
          english
          native
          userPreferred
        }
        coverImage {
          large
          medium
        }
        bannerImage
        description
        episodes
        genres
        averageScore
        format
        season
        seasonYear
        studios(isMain: true) {
          nodes {
            id
            name
          }
        }
        type
      }
    }
    popular: Page(page: 1, perPage: 6) {
      media(sort: POPULARITY_DESC, type: ANIME) {
        id
        title {
          romaji
          english
          native
          userPreferred
        }
        coverImage {
          large
          medium
        }
        type
      }
    }
    upcoming: Page(page: 1, perPage: 6) {
      media(sort: POPULARITY_DESC, type: ANIME, status: NOT_YET_RELEASED) {
        id
        title {
          romaji
          english
          native
          userPreferred
        }
        coverImage {
          large
          medium
        }
        type
      }
    }
  }
`;

export const searchAnime = async (
  search: string,
  page = 1,
  perPage = 20,
  type: "ANIME" | "MANGA" = "ANIME"
): Promise<AnimeSearchResponse> => {
  const response = await fetch(ANILIST_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: searchQuery,
      variables: {
        search,
        page,
        perPage,
        type,
      },
    }),
  });

  const data = await response.json();
  
  if (data.errors) {
    console.error("Errore nella ricerca degli anime:", data.errors);
    throw new Error(data.errors[0].message);
  }
  
  return data;
};

export const getTrendingAnime = async (): Promise<TrendingAnimeResponse> => {
  const response = await fetch(ANILIST_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: trendingQuery,
    }),
  });

  const data = await response.json();
  
  if (data.errors) {
    console.error("Errore nel recupero degli anime di tendenza:", data.errors);
    throw new Error(data.errors[0].message);
  }
  
  return data;
};
