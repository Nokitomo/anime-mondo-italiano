
export interface AnimeMedia {
  id: number;
  title: {
    romaji: string;
    english: string;
    native: string;
    userPreferred: string;
  };
  coverImage: {
    large: string;
    medium: string;
  };
  bannerImage: string | null;
  description: string;
  episodes: number | null;
  chapters: number | null;
  genres: string[];
  averageScore: number;
  meanScore: number;
  format: string;
  status: string;
  season: string;
  seasonYear: number;
  startDate: {
    year: number;
    month: number;
    day: number;
  };
  endDate: {
    year: number;
    month: number;
    day: number;
  };
  studios: {
    nodes: {
      id: number;
      name: string;
    }[];
  };
  type: "ANIME" | "MANGA";
  nextAiringEpisode?: {
    airingAt: number;
    timeUntilAiring: number;
    episode: number;
  };
  
  // Add missing properties referenced in components
  characters?: {
    nodes: {
      id: number;
      name: {
        full: string;
        native: string;
      };
      image: {
        medium: string;
        large: string;
      };
      gender: string | null;
      age: string | null;
      description: string | null;
      isFavourite: boolean;
    }[];
    edges: {
      role: string;
      voiceActors: {
        id: number;
        name: {
          full: string;
          native: string;
        };
        image: {
          medium: string;
          large: string;
        };
      }[];
    }[];
  };
  
  staff?: {
    edges: {
      role: string;
      node: {
        id: number;
        name: {
          full: string;
          native: string;
        };
        image: {
          medium: string;
          large: string;
        };
      };
    }[];
  };
  
  relations?: {
    edges: {
      relationType: string;
      node: {
        id: number;
        title: {
          romaji: string;
          english: string;
          native: string;
          userPreferred: string;
        };
        coverImage: {
          large: string;
          medium: string;
        };
        format: string;
        type: "ANIME" | "MANGA";
      };
    }[];
  };
  
  recommendations?: {
    nodes: {
      mediaRecommendation: {
        id: number;
        title: {
          romaji: string;
          english: string;
          native: string;
          userPreferred: string;
        };
        coverImage: {
          large: string;
          medium: string;
        };
        format: string;
        type: "ANIME" | "MANGA";
      };
    }[];
  };
}
