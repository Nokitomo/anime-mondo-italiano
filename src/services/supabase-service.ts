
// Usa l'istanza unica di Supabase da src/integrations/supabase/client.ts
import { supabase } from "@/integrations/supabase/client";

// Tipi di risposta per l'autenticazione
export type AuthResponse = {
  success: boolean
  error?: string
  user?: any
}

// Recupera l'utente attualmente autenticato
export const getCurrentUser = async () => {
  try {
    const { data } = await supabase.auth.getSession()
    return data?.session?.user
  } catch (error) {
    console.error("Errore nel recupero dell'utente corrente:", error)
    return null
  }
}

// Tipi e funzioni per la gestione della lista anime dell'utente

export type AnimeListItem = {
  id: string
  user_id: string
  anime_id: number
  status: "IN_CORSO" | "COMPLETATO" | "IN_PAUSA" | "ABBANDONATO" | "PIANIFICATO"
  progress: number
  score: number
  notes: string
  title?: string | null
  cover_image?: string | null
  format?: string | null
  created_at: string
  updated_at?: string
}

// Verifica se la tabella anime_list esiste (placeholder)
export const checkAnimeTable = async (): Promise<boolean> => {
  try {
    // In Supabase non si possono creare tabelle via client JS
    console.warn(
      "La tabella anime_list non esiste. Creala manualmente su https://app.supabase.com"
    )
    return false
  } catch (error) {
    console.error("Errore nella verifica della tabella anime_list:", error)
    return false
  }
}

// Recupera la lista anime dell'utente
export const getUserAnimeList = async (
  userId: string
): Promise<AnimeListItem[] | null> => {
  try {
    const { data, error } = await supabase
      .from("anime_list")
      .select("*")
      .eq("user_id", userId)
    if (error) throw error
    return data as AnimeListItem[]
  } catch (error) {
    console.error("Errore nel recupero della lista anime:", error)
    return null
  }
}

// Aggiunge un anime alla lista dell'utente
export const addAnimeToList = async (
  animeId: number,
  status: AnimeListItem["status"],
  progress: number,
  score: number,
  notes: string,
  title?: string,
  coverImage?: string,
  format?: string
): Promise<[AnimeListItem]> => {
  try {
    const user = await getCurrentUser()
    if (!user) throw new Error("Utente non autenticato")

    const { data, error } = await supabase
      .from("anime_list")
      .insert({
        user_id: user.id,
        anime_id: animeId,
        status,
        progress,
        score,
        notes,
        title,
        cover_image: coverImage,
        format,
      })
      .select()

    if (error) throw error
    return data as [AnimeListItem]
  } catch (error) {
    console.error("Errore nell'aggiunta dell'anime alla lista:", error)
    throw error
  }
}

// Verifica se un anime esiste già nella lista dell'utente
export const checkAnimeInUserList = async (
  animeId: number
): Promise<AnimeListItem | null> => {
  try {
    const user = await getCurrentUser()
    if (!user) throw new Error("Utente non autenticato")

    const { data: existing, error } = await supabase
      .from("anime_list")
      .select("*")
      .eq("user_id", user.id)
      .eq("anime_id", animeId)
      .single()

    if (error && error.code !== "PGRST116") throw error
    return existing as AnimeListItem | null
  } catch (error) {
    console.error("Errore nel controllo anime esistente:", error)
    return null
  }
}

// Aggiorna i dati di un anime già presente nella lista
export const updateAnimeInList = async (
  id: string,
  updates: Partial<Omit<AnimeListItem, "id" | "user_id" | "anime_id" | "created_at">>
): Promise<[AnimeListItem]> => {
  try {
    const { data, error } = await supabase
      .from("anime_list")
      .update(updates)
      .eq("id", id)
      .select()

    if (error) throw error
    return data as [AnimeListItem]
  } catch (error) {
    console.error("Errore nell'aggiornamento dell'anime nella lista:", error)
    throw error
  }
}

// Rimuove un anime dalla lista dell'utente
export const removeAnimeFromList = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("anime_list")
      .delete()
      .eq("id", id)

    if (error) throw error
    return true
  } catch (error) {
    console.error("Errore nella rimozione dell'anime dalla lista:", error)
    return false
  }
}
