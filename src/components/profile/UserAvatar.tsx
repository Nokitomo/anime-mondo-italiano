
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserAvatarProps {
  email: string | undefined;
}

export const UserAvatar = ({ email }: UserAvatarProps) => {
  const userInitial = email ? email[0].toUpperCase() : "U";

  return (
    <div className="flex flex-col items-center mb-8">
      <Avatar className="h-24 w-24 mb-4">
        <AvatarFallback className="text-4xl">{userInitial}</AvatarFallback>
      </Avatar>
      <h2 className="text-2xl font-bold">{email}</h2>
    </div>
  );
};
