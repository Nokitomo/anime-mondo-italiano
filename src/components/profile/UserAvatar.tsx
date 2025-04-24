
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Cog } from "lucide-react";
import { EditProfileDialog } from "./EditProfileDialog";

interface UserAvatarProps {
  email: string | undefined;
  username?: string;
}

export const UserAvatar = ({ email, username }: UserAvatarProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const userInitial = email ? email[0].toUpperCase() : "U";

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
        <AvatarFallback className="text-4xl">{userInitial}</AvatarFallback>
      </Avatar>
      <h2 className="text-2xl font-bold">{username || email}</h2>
      <EditProfileDialog 
        open={isEditOpen} 
        onOpenChange={setIsEditOpen}
        currentUsername={username}
      />
    </div>
  );
};
