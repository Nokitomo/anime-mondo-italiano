
export const ANILIST_API_URL = "https://graphql.anilist.co";

export const ANIME_SEARCH_QUERY = `
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

export const ANIME_TRENDING_QUERY = `
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

export const ANIME_DETAILS_QUERY = `
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
