
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProfileAvatarUpload } from "./ProfileAvatarUpload";
import { useProfileUpdate } from "@/hooks/useProfileUpdate";

interface ProfileFormProps {
  initialUsername: string;
  email: string;
  currentAvatarUrl: string | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ProfileForm = ({
  initialUsername,
  email,
  currentAvatarUrl,
  onSuccess,
  onCancel
}: ProfileFormProps) => {
  const [username, setUsername] = useState(initialUsername);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(currentAvatarUrl);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const { loading, updateProfile } = useProfileUpdate();

  const handleFileSelect = (file: File) => {
    setFileToUpload(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateProfile(username, fileToUpload);
    if (success) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col items-center gap-4">
        <ProfileAvatarUpload
          currentAvatarUrl={avatarUrl}
          username={username}
          email={email}
          onFileSelect={handleFileSelect}
        />
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
      
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onCancel} type="button">
          Annulla
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Salvataggio..." : "Salva"}
        </Button>
      </div>
    </form>
  );
};
