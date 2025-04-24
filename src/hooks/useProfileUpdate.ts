
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const useProfileUpdate = () => {
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const uploadAvatar = async (file: File) => {
    if (!user) return null;
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (uploadError) throw uploadError;
      
      const { data } = await supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
        
      return data.publicUrl;
    } catch (error: any) {
      console.error("Avatar upload error:", error);
      throw error;
    }
  };

  const updateProfile = async (username: string, file: File | null) => {
    if (!user) return;
    
    setLoading(true);
    try {
      let uploadedAvatarUrl = user.avatar_url;
      
      if (file) {
        const newAvatarUrl = await uploadAvatar(file);
        if (newAvatarUrl) {
          uploadedAvatarUrl = newAvatarUrl;
        }
      }
      
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ 
          username, 
          avatar_url: uploadedAvatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      setUser({ 
        username, 
        ...(uploadedAvatarUrl && { avatar_url: uploadedAvatarUrl }) 
      });

      queryClient.invalidateQueries({ queryKey: ["profile", user.id] });
      
      toast({
        title: "Profilo aggiornato",
        description: "Le modifiche sono state salvate con successo",
      });
      
      return true;
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast({
        title: "Errore",
        description: error.message || "Impossibile aggiornare il profilo",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    updateProfile
  };
};
