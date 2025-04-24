
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { getUserAnimeList } from "@/services/supabase-service";
import { useQuery } from "@tanstack/react-query";
import { UserAvatar } from "@/components/profile/UserAvatar";
import { ProfileStats } from "@/components/profile/ProfileStats";

const Profile = () => {
  const { user, loading } = useAuth();
  
  const { data: animeList, isLoading: loadingList } = useQuery({
    queryKey: ["animeList", user?.id],
    queryFn: () => user ? getUserAnimeList(user.id) : Promise.resolve([]),
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
      <UserAvatar 
        email={user.email} 
        username={user.username} 
      />
      <ProfileStats animeList={animeList} />
    </div>
  );
};

export default Profile;
