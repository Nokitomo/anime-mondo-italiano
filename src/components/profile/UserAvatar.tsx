
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Cog } from "lucide-react";
import { EditProfileDialog } from "./EditProfileDialog";
import { useAuth } from "@/hooks/useAuth";

interface UserAvatarProps {
  email: string | undefined;
  username?: string;
}

export const UserAvatar = ({ email, username }: UserAvatarProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { user } = useAuth();
  
  const userInitial = username ? username[0].toUpperCase() : email ? email[0].toUpperCase() : "U";
  const displayName = username || email || "Utente";
  
  // Utilizziamo l'avatar_url se presente nell'oggetto utente
  const avatarUrl = user?.avatar_url || null;

  return (
    <div className="relative flex flex-col items-center mb-8">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0"
        onClick={() => setIsEditOpen(true)}
      >
        <Cog className="h-5 w-5" />
      </Button>
      <Avatar className="h-24 w-24 mb-4">
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} alt={displayName} />
        ) : (
          <AvatarFallback className="text-4xl">{userInitial}</AvatarFallback>
        )}
      </Avatar>
      <h2 className="text-2xl font-bold">{displayName}</h2>
      <EditProfileDialog 
        open={isEditOpen} 
        onOpenChange={setIsEditOpen}
        currentUsername={username}
      />
    </div>
  );
};
