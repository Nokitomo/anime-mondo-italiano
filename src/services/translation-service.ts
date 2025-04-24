
// Servizio per la traduzione di testi usando Microsoft Translator API

// Funzione per tradurre un testo da una lingua all'altra
export const translateText = async (text: string): Promise<string> => {
  if (!text) return '';
  
  // Se non abbiamo impostato la chiave API o l'endpoint, ritorniamo il testo originale
  const apiKey = import.meta.env.VITE_AZURE_TRANSLATOR_KEY;
  const endpoint = import.meta.env.VITE_AZURE_TRANSLATOR_ENDPOINT;
  
  if (!apiKey || !endpoint) {
    console.warn('Chiave API o endpoint di Azure Translator non configurati. Utilizzando il testo originale.');
    return text;
  }
  
  try {
    const url = `${endpoint}/translate?api-version=3.0&from=en&to=it`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': apiKey,
        'Ocp-Apim-Subscription-Region': 'westeurope' // La regione del tuo servizio
      },
      body: JSON.stringify([{ 'text': text }])
    });
    
    if (!response.ok) {
      throw new Error(`Errore nella chiamata API: ${response.status}`);
    }
    
    const data = await response.json();
    return data[0]?.translations[0]?.text || text;
  } catch (error) {
    console.error('Errore durante la traduzione:', error);
    return text; // In caso di errore, ritorniamo il testo originale
  }
};

// Funzione per tradurre i dettagli di un anime
export const translateAnimeDetails = async (details: any) => {
  if (!details) return details;
  
  const translatedDetails = { ...details };
  
  // Traduciamo solo i campi testuali che potrebbero contenere testo in inglese
  if (details.description) {
    translatedDetails.description = await translateText(details.description);
  }
  
  if (details.title?.english) {
    translatedDetails.title = {
      ...details.title,
      italian: await translateText(details.title.english)
    };
  }
  
  // Potremmo tradurre anche altri campi se necessario
  
  return translatedDetails;
};
