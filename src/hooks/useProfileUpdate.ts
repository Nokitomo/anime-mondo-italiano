
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { ProfileService } from "@/services/profile-service";
import { useAuth } from "@/hooks/useAuth";

export const useProfileUpdate = () => {
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const updateProfile = async (username: string, file: File | null) => {
    if (!user) return;
    
    setLoading(true);
    try {
      let uploadedAvatarUrl = user.avatar_url;
      
      if (file) {
        const newAvatarUrl = await ProfileService.uploadAvatar(user.id, file);
        if (newAvatarUrl) {
          uploadedAvatarUrl = newAvatarUrl;
        }
      }
      
      await ProfileService.updateProfile(user.id, { 
        username, 
        ...(uploadedAvatarUrl && { avatar_url: uploadedAvatarUrl })
      });

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
      console.error("Errore nell'aggiornamento del profilo:", error);
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
