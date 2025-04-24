
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/types/database.types";

export type Profile = Database['public']['Tables']['profiles']['Row'];

export class ProfileService {
  static async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("Errore nel recupero del profilo:", error);
      throw error;
    }

    return data;
  }

  static async uploadAvatar(userId: string, file: File): Promise<string | null> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.error("Errore nel caricamento dell'avatar:", uploadError);
      throw uploadError;
    }

    const { data } = await supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  static async updateProfile(userId: string, data: { username: string; avatar_url?: string }): Promise<void> {
    const { error } = await supabase
      .from("profiles")
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq("id", userId);

    if (error) {
      console.error("Errore nell'aggiornamento del profilo:", error);
      throw error;
    }
  }
}
