
// In futuro questo servizio utilizzerà Microsoft Translator API

export const translateText = async (text: string): Promise<string> => {
  // Per ora ritorniamo il testo originale
  // La traduzione verrà implementata quando collegheremo l'API di Microsoft Translator
  return text;
};

export const translateAnimeDetails = async (details: any) => {
  // Nel futuro implementeremo la traduzione effettiva
  // Per ora ritorniamo i dettagli originali
  return details;
};
