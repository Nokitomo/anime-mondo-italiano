
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUsername?: string;
}

export const EditProfileDialog = ({ open, onOpenChange, currentUsername }: EditProfileDialogProps) => {
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [username, setUsername] = useState(currentUsername || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);

  // Utilizziamo useQuery per ottenere il profilo utente
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("username, avatar_url")
          .eq("id", user.id)
          .single();
          
        if (error) {
          console.error("Errore nel caricamento del profilo:", error);
          return null;
        }
        
        return data;
      } catch (error) {
        console.error("Errore nella query del profilo:", error);
        return null;
      }
    },
    enabled: !!user && open,
  });

  // Aggiorniamo lo stato locale quando il profilo viene caricato
  useEffect(() => {
    if (profile) {
      if (profile.username) {
        setUsername(profile.username);
      }
      if (profile.avatar_url) {
        setAvatarUrl(profile.avatar_url);
      }
    }
  }, [profile, open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
          title: "File troppo grande",
          description: "L'immagine deve essere inferiore a 2MB",
          variant: "destructive",
        });
        return;
      }
      
      setFileToUpload(file);
      
      // Preview dell'immagine
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async () => {
    if (!user || !fileToUpload) return null;
    
    setUploadingAvatar(true);
    try {
      const fileExt = fileToUpload.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = fileName;
      
      // Verifichiamo che il bucket esista
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        throw new Error(`Errore durante la verifica dei bucket: ${bucketsError.message}`);
      }
      
      const avatarBucketExists = buckets.some(bucket => bucket.name === 'avatars');
      
      if (!avatarBucketExists) {
        throw new Error("Il bucket 'avatars' non esiste. Contatta l'amministratore.");
      }
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, fileToUpload, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (uploadError) throw uploadError;
      
      const { data } = await supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (error: any) {
      console.error("Errore durante il caricamento dell'immagine:", error);
      toast({
        title: "Errore",
        description: `Errore durante il caricamento dell'immagine: ${error.message}`,
        variant: "destructive",
      });
      return null;
    } finally {
      setUploadingAvatar(false);
    }
  };

  const removeAvatar = () => {
    setAvatarUrl(null);
    setFileToUpload(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      let uploadedAvatarUrl = avatarUrl;
      
      // Upload avatar if there's a new file
      if (fileToUpload) {
        uploadedAvatarUrl = await uploadAvatar();
        if (!uploadedAvatarUrl) {
          setLoading(false);
          return;
        }
      }
      
      console.log("Aggiornamento profilo con:", { username, avatar_url: uploadedAvatarUrl });
      
      // Aggiorna il profilo
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ 
          username,
          avatar_url: uploadedAvatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq("id", user.id);

      if (profileError) {
        console.error("Errore nell'aggiornamento del profilo:", profileError);
        throw profileError;
      }

      // Update user context with new username and avatar
      setUser({ 
        username, 
        ...(uploadedAvatarUrl && { avatar_url: uploadedAvatarUrl }) 
      });

      // Aggiorna email se modificata
      if (email !== user.email) {
        const { error: emailError, data } = await supabase.auth.updateUser({ email });
        if (emailError) throw emailError;
        if (data.user) {
          setUser({ email: data.user.email });
        }
      }

      // Aggiorna password se inserita
      if (password) {
        const { error: passwordError } = await supabase.auth.updateUser({ password });
        if (passwordError) throw passwordError;
      }

      toast({
        title: "Profilo aggiornato",
        description: "Le modifiche sono state salvate con successo",
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["profile", user.id] });
      
      onOpenChange(false);
    } catch (error: any) {
      console.error("Errore durante l'aggiornamento:", error);
      toast({
        title: "Errore",
        description: error.message || "Si è verificato un errore durante l'aggiornamento",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modifica profilo</DialogTitle>
        </DialogHeader>
        {isLoadingProfile ? (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <Avatar className="h-24 w-24">
                  {avatarUrl ? (
                    <AvatarImage src={avatarUrl} alt="Profile" className="object-cover" />
                  ) : (
                    <AvatarFallback className="text-4xl">
                      {username ? username[0].toUpperCase() : email ? email[0].toUpperCase() : "U"}
                    </AvatarFallback>
                  )}
                </Avatar>
                <label 
                  htmlFor="avatar-upload" 
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                >
                  <Upload className="h-6 w-6 text-white" />
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {avatarUrl && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={removeAvatar}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <span className="text-sm text-muted-foreground">
                Clicca sull'immagine per cambiarla
              </span>
            </div>
            
            <div>
              <label htmlFor="username" className="text-sm font-medium">
                Nome utente
              </label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Il tuo nome utente"
              />
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="La tua email"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-medium">
                Nuova password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Lascia vuoto per non modificare"
              />
            </div>
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
                Annulla
              </Button>
              <Button type="submit" disabled={loading || uploadingAvatar}>
                {loading || uploadingAvatar ? "Salvataggio..." : "Salva"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
