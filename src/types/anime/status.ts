
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
