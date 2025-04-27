
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
}
