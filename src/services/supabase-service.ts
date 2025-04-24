
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

// Inizializzazione del cliente Supabase con la chiave pubblica
export const supabase = createClient<Database>(
  'https://buzymhfvxyescbrqguga.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1enltaGZ2eHllc2NicnFndWdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MTE5ODIsImV4cCI6MjA2MTA4Nzk4Mn0.obDrwD4s1is-gphqdv2Vra66md3eXjmJtE4cHUHr-QA'
);

// Tipi di risposta per l'autenticazione
export type AuthResponse = {
  success: boolean;
  error?: string;
  user?: any;
};

// Funzioni di autenticazione
export const signUp = async (email: string, password: string, username: string): Promise<AuthResponse> => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    // Se l'autenticazione è riuscita, creiamo un profilo utente nel database
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          { id: authData.user.id, username, created_at: new Date().toISOString() },
        ]);

      if (profileError) throw profileError;
    }

    return { success: true, user: authData.user };
  } catch (error: any) {
    console.error('Errore nella registrazione:', error.message);
    return {
      success: false,
      error: error.message || 'Si è verificato un errore durante la registrazione.',
    };
  }
};

export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return { success: true, user: data.user };
  } catch (error: any) {
    console.error('Errore nel login:', error.message);
    return {
      success: false,
      error: error.message || 'Si è verificato un errore durante il login.',
    };
  }
};

export const signOut = async (): Promise<AuthResponse> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Errore nel logout:', error.message);
    return {
      success: false,
      error: error.message || 'Si è verificato un errore durante il logout.',
    };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data } = await supabase.auth.getSession();
    return data?.session?.user;
  } catch (error) {
    console.error('Errore nel recupero dell\'utente corrente:', error);
    return null;
  }
};

// Funzioni per la gestione della lista anime dell'utente
export type AnimeListItem = {
  id: string;
  user_id: string;
  anime_id: number;
  status: 'IN_CORSO' | 'COMPLETATO' | 'IN_PAUSA' | 'ABBANDONATO' | 'PIANIFICATO';
  progress: number;
  score: number;
  notes: string;
  title?: string;
  cover_image?: string;
  format?: string;
  created_at: string;
  updated_at: string;
};

export const getUserAnimeList = async (userId: string): Promise<AnimeListItem[]> => {
  try {
    const { data, error } = await supabase
      .from('anime_list')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Errore nel recupero della lista anime:', error.message);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Errore nel recupero della lista anime:', error);
    return [];
  }
};

export const addAnimeToList = async (
  animeId: number,
  status: 'IN_CORSO' | 'COMPLETATO' | 'IN_PAUSA' | 'ABBANDONATO' | 'PIANIFICATO',
  progress: number = 0,
  score: number = 0,
  notes: string = '',
  title: string = '',
  coverImage: string = '',
  format: string = ''
) => {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error('Utente non autenticato');
    }
    
    // Verifica se l'anime è già nella lista
    const { data: existingAnime, error: checkError } = await supabase
      .from('anime_list')
      .select('id')
      .eq('user_id', user.id)
      .eq('anime_id', animeId)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 significa "nessun risultato", che è ciò che vogliamo
      console.error('Errore nel controllo anime esistente:', checkError);
      throw checkError;
    }
    
    if (existingAnime) {
      // L'anime è già nella lista, aggiorniamo i dati
      const { data, error } = await supabase
        .from('anime_list')
        .update({
          status,
          progress,
          score,
          notes,
          title: title,
          cover_image: coverImage,
          format: format,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingAnime.id)
        .select();
      
      if (error) {
        console.error('Errore nell\'aggiornamento dell\'anime nella lista:', error);
        throw error;
      }
      
      return data;
    } else {
      // L'anime non è nella lista, lo aggiungiamo
      const { data, error } = await supabase
        .from('anime_list')
        .insert([
          {
            user_id: user.id,
            anime_id: animeId,
            status,
            progress,
            score,
            notes,
            title: title,
            cover_image: coverImage,
            format: format,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select();
      
      if (error) {
        console.error('Errore nell\'aggiunta dell\'anime alla lista:', error);
        throw error;
      }
      
      return data;
    }
  } catch (error) {
    console.error('Errore nell\'operazione con la lista anime:', error);
    throw error;
  }
};

export const updateAnimeInList = async (
  id: string,
  updates: Partial<Omit<AnimeListItem, 'id' | 'user_id' | 'anime_id' | 'created_at'>>
) => {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error('Utente non autenticato');
    }
    
    // Aggiorniamo la data di modifica
    updates.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('anime_list')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id) // Assicuriamoci che l'utente stia modificando solo i propri dati
      .select();
    
    if (error) {
      console.error('Errore nell\'aggiornamento dell\'anime nella lista:', error.message);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Errore nell\'aggiornamento dell\'anime nella lista:', error);
    throw error;
  }
};

export const removeAnimeFromList = async (id: string) => {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error('Utente non autenticato');
    }
    
    const { error } = await supabase
      .from('anime_list')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id); // Sicurezza aggiuntiva
    
    if (error) {
      console.error('Errore nella rimozione dell\'anime dalla lista:', error.message);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Errore nella rimozione dell\'anime dalla lista:', error);
    throw error;
  }
};

export const checkAnimeInUserList = async (animeId: number): Promise<AnimeListItem | null> => {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return null;
    }
    
    const { data, error } = await supabase
      .from('anime_list')
      .select('*')
      .eq('user_id', user.id)
      .eq('anime_id', animeId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') { // Nessun risultato
        return null;
      }
      console.error('Errore nel controllo anime nella lista:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Errore nel controllo anime nella lista:', error);
    return null;
  }
};
