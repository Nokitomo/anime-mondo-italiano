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
}

export interface AnimeSearchResponse {
  data: {
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
  };
}

export interface TrendingAnimeResponse {
  data: {
    trending: {
      media: AnimeMedia[];
    };
    popular: {
      media: AnimeMedia[];
    };
    upcoming: {
      media: AnimeMedia[];
    };
  };
}

export interface AnimeDetailsResponse {
  data: {
    Media: AnimeMedia;
  };
}

export interface UserAnimeItem extends AnimeMedia {
  status: "IN_CORSO" | "COMPLETATO" | "IN_PAUSA" | "ABBANDONATO" | "PIANIFICATO" | "REWATCH";
  progress: number;
  score: number;
  notes: string;
}

export type AnimeStatus = "IN_CORSO" | "COMPLETATO" | "IN_PAUSA" | "ABBANDONATO" | "PIANIFICATO" | "REWATCH";

export const statusLabels: Record<AnimeStatus, string> = {
  IN_CORSO: "In visione",
  COMPLETATO: "Completato",
  IN_PAUSA: "In pausa",
  ABBANDONATO: "Abbandonato",
  PIANIFICATO: "Da vedere",
  REWATCH: "Rivisto"
};

export const formatLabels: Record<string, string> = {
  TV: "Serie TV",
  MOVIE: "Film",
  OVA: "OVA",
  ONA: "ONA",
  SPECIAL: "Speciale",
  MANGA: "Manga",
  NOVEL: "Light Novel"
};

export const relationLabels: Record<string, string> = {
  SEQUEL: "Sequel",
  PREQUEL: "Prequel",
  PARENT: "Opera originale",
  SIDE_STORY: "Storia parallela",
  CHARACTER: "Personaggio condiviso",
  SUMMARY: "Riassunto",
  ALTERNATIVE: "Versione alternativa",
  SPIN_OFF: "Spin-off",
  ADAPTATION: "Adattamento",
  CONTAINS: "Contiene",
  SOURCE: "Fonte",
  OTHER: "Altro"
};
