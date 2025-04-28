
import {
  AnimeSearchResponse,
  TrendingAnimeResponse,
  AnimeDetailsResponse,
} from "@/types/anime";

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

const detailsQuery = `
  query ($id: Int) {
    Media(id: $id) {
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
      studios {
        nodes {
          id
          name
        }
      }
      type
      relations {
        edges {
          relationType
          node {
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
            format
            type
          }
        }
      }
      recommendations(sort: RATING_DESC) {
        nodes {
          mediaRecommendation {
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
            format
            type
          }
        }
      }
      characters(sort: ROLE, perPage: 10) {
        nodes {
          id
          name {
            full
            native
          }
          image {
            medium
            large
          }
          gender
          age
          description
          isFavourite
        }
        edges {
          role
          voiceActors(language: JAPANESE) {
            id
            name {
              full
              native
            }
            image {
              medium
              large
            }
          }
        }
      }
      staff {
        edges {
          role
          node {
            id
            name {
              full
              native
            }
            image {
              medium
              large
            }
          }
        }
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
  try {
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

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.errors) {
      console.error("Errore nella ricerca degli anime:", data.errors);
      throw new Error(data.errors[0].message);
    }

    return data;
  } catch (error) {
    console.error("Errore nella ricerca degli anime:", error);
    throw error;
  }
};

export const getTrendingAnime = async (): Promise<TrendingAnimeResponse> => {
  try {
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

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.errors) {
      console.error("Errore nel recupero degli anime di tendenza:", data.errors);
      throw new Error(data.errors[0].message);
    }

    return data;
  } catch (error) {
    console.error("Errore nel recupero degli anime di tendenza:", error);
    throw error;
  }
};

export const getAnimeDetails = async (
  id: number
): Promise<AnimeDetailsResponse> => {
  try {
    const response = await fetch(ANILIST_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: detailsQuery,
        variables: { id },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.errors) {
      console.error("Errore nel recupero dei dettagli dell'anime:", data.errors);
      throw new Error(data.errors[0].message);
    }

    return data;
  } catch (error) {
    console.error("Errore nel recupero dei dettagli dell'anime:", error);
    throw error;
  }
};
