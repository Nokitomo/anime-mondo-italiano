
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { getUserAnimeList } from "@/services/supabase-service";
import { useQuery } from "@tanstack/react-query";
import { UserAvatar } from "@/components/profile/UserAvatar";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const { user, loading } = useAuth();
  
  const { data: animeList, isLoading: loadingList } = useQuery({
    queryKey: ["animeList", user?.id],
    queryFn: () => user ? getUserAnimeList(user.id) : Promise.resolve([]),
    enabled: !!user,
  });

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();
      return data;
    },
    enabled: !!user,
  });
  
  if (loading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse h-8 w-48 bg-muted rounded mb-8"></div>
        <div className="animate-pulse h-48 w-full bg-muted rounded"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="container py-8">
      <UserAvatar email={user.email} username={profile?.username} />
      <ProfileStats animeList={animeList} />
    </div>
  );
};

export default Profile;
