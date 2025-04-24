
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

export interface UserAnimeItem extends AnimeMedia {
  status: "IN_CORSO" | "COMPLETATO" | "IN_PAUSA" | "ABBANDONATO" | "PIANIFICATO";
  progress: number;
  score: number;
  notes: string;
}

export type AnimeStatus = "IN_CORSO" | "COMPLETATO" | "IN_PAUSA" | "ABBANDONATO" | "PIANIFICATO";

export const statusLabels: Record<AnimeStatus, string> = {
  IN_CORSO: "In visione",
  COMPLETATO: "Completato",
  IN_PAUSA: "In pausa",
  ABBANDONATO: "Abbandonato",
  PIANIFICATO: "Da vedere"
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
