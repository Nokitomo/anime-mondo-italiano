import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProfileForm } from "./ProfileForm";
import { supabase } from "@/integrations/supabase/client";
import { ProfileService } from "@/services/profile-service";
import { Separator } from "@/components/ui/separator";
import { DeleteAccountDialog } from "./DeleteAccountDialog";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUsername?: string;
}

export const EditProfileDialog = ({ open, onOpenChange, currentUsername }: EditProfileDialogProps) => {
  const { user } = useAuth();

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => user ? ProfileService.getProfile(user.id) : null,
    enabled: !!user && open,
  });

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
          <>
            <ProfileForm
              initialUsername={profile?.username || currentUsername || ""}
              email={user?.email || ""}
              currentAvatarUrl={profile?.avatar_url || null}
              onSuccess={() => onOpenChange(false)}
              onCancel={() => onOpenChange(false)}
            />
            <Separator className="my-4" />
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-destructive">Zona Pericolosa</h3>
              <DeleteAccountDialog />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
