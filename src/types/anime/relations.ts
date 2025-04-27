
import type { AnimeMedia } from "./media";

export interface RelationsData {
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
}

export interface RecommendationsData {
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
}

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
