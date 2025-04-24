
import { useState } from "react";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileAvatarUploadProps {
  currentAvatarUrl: string | null;
  username: string;
  email: string;
  onFileSelect: (file: File) => void;
}

export const ProfileAvatarUpload = ({
  currentAvatarUrl,
  username,
  email,
  onFileSelect,
}: ProfileAvatarUploadProps) => {
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File troppo grande",
          description: "L'immagine deve essere inferiore a 2MB",
          variant: "destructive",
        });
        return;
      }
      onFileSelect(file);
    }
  };

  return (
    <div className="relative group">
      <Avatar className="h-24 w-24">
        {currentAvatarUrl ? (
          <AvatarImage src={currentAvatarUrl} alt="Profile" className="object-cover" />
        ) : (
          <AvatarFallback>
            {username ? username[0].toUpperCase() : email[0].toUpperCase()}
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
    </div>
  );
};
