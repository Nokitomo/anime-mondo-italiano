
import { ANILIST_API_URL } from './constants';

interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{ message: string }>;
}

export async function queryAnilistAPI<T>(query: string, variables?: Record<string, any>): Promise<GraphQLResponse<T>> {
  try {
    const response = await fetch(ANILIST_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: GraphQLResponse<T> = await response.json();

    if (data.errors) {
      console.error("Errore nella query GraphQL:", data.errors);
      throw new Error(data.errors[0].message);
    }

    return data;
  } catch (error) {
    console.error("Errore nella richiesta API:", error);
    throw error;
  }
}
