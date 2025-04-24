
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getUserAnimeList } from "@/services/supabase-service";
import { useQuery } from "@tanstack/react-query";

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
  
  const userInitial = user?.email ? user.email[0].toUpperCase() : "U";
  
  const stats = {
    totalAnime: animeList?.length || 0,
    watching: animeList?.filter(a => a.status === "IN_CORSO").length || 0,
    completed: animeList?.filter(a => a.status === "COMPLETATO").length || 0,
    planned: animeList?.filter(a => a.status === "PIANIFICATO").length || 0,
    averageScore: animeList && animeList.length > 0 
      ? Math.round(animeList.reduce((acc, curr) => acc + (curr.score || 0), 0) / animeList.length) 
      : 0
  };
  
  return (
    <div className="container py-8">
      <div className="flex flex-col items-center mb-8">
        <Avatar className="h-24 w-24 mb-4">
          <AvatarFallback className="text-4xl">{userInitial}</AvatarFallback>
        </Avatar>
        <h2 className="text-2xl font-bold">{user.email}</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Totale Anime</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalAnime}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>In Corso</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.watching}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Completati</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.completed}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Da Vedere</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.planned}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Voto Medio</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.averageScore}/10</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
