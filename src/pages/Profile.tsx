
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { getUserAnimeList } from "@/services/supabase-service";
import { AnimeCard, AnimeCardSkeleton } from "@/components/AnimeCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { statusLabels, AnimeStatus } from "@/types/anime";
import { useQuery } from "@tanstack/react-query";

// Create a partial type for the anime data from user list
type AnimePartial = {
  id: number;
  title: {
    romaji: string;
    english: string;
    native: string;
    userPreferred: string;
  };
  coverImage: {
    large: string;
    medium: string;
  };
  format: string;
  type: "ANIME" | "MANGA";
  genres: string[];
  bannerImage: string | null;
  description: string;
  episodes: number | null;
  chapters: number | null;
  averageScore: number;
  meanScore: number;
  status: string;
  season: string;
  seasonYear: number;
  startDate: {
    year: number;
    month: number;
    day: number;
  };
  endDate: {
    year: number;
    month: number;
    day: number;
  };
  studios: {
    nodes: {
      id: number;
      name: string;
    }[];
  };
  nextAiringEpisode?: {
    airingAt: number;
    timeUntilAiring: number;
    episode: number;
  };
};

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
  
  // Raggruppa gli anime per stato
  const groupedAnime = animeList?.reduce((acc, item) => {
    if (!acc[item.status]) {
      acc[item.status] = [];
    }
    acc[item.status].push(item);
    return acc;
  }, {} as Record<AnimeStatus, typeof animeList>) || {};
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Il mio profilo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Informazioni</h2>
          <p><span className="text-muted-foreground">Email:</span> {user.email}</p>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-4">La mia lista anime</h2>
      
      {loadingList ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array(6).fill(0).map((_, i) => (
            <AnimeCardSkeleton key={i} />
          ))}
        </div>
      ) : animeList && animeList.length > 0 ? (
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">Tutti</TabsTrigger>
            {Object.keys(statusLabels).map((status) => 
              groupedAnime[status as AnimeStatus]?.length ? (
                <TabsTrigger key={status} value={status}>
                  {statusLabels[status as AnimeStatus]}
                </TabsTrigger>
              ) : null
            )}
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {animeList.map((item) => (
                <AnimeCard 
                  key={item.id} 
                  anime={{
                    id: item.anime_id,
                    title: {
                      romaji: item.title || "Titolo non disponibile",
                      english: "",
                      native: "",
                      userPreferred: item.title || "Titolo non disponibile"
                    },
                    coverImage: {
                      large: item.cover_image || "",
                      medium: item.cover_image || ""
                    },
                    format: item.format || "",
                    type: "ANIME",
                    genres: [],
                    bannerImage: null,
                    description: "",
                    episodes: null,
                    chapters: null,
                    averageScore: 0,
                    meanScore: 0,
                    status: "",
                    season: "",
                    seasonYear: 0,
                    startDate: {
                      year: 0,
                      month: 0,
                      day: 0
                    },
                    endDate: {
                      year: 0,
                      month: 0,
                      day: 0
                    },
                    studios: {
                      nodes: []
                    }
                  }}
                  statusBadge={statusLabels[item.status]}
                />
              ))}
            </div>
          </TabsContent>
          
          {Object.keys(statusLabels).map((status) => 
            groupedAnime[status as AnimeStatus]?.length ? (
              <TabsContent key={status} value={status} className="mt-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {groupedAnime[status as AnimeStatus].map((item) => (
                    <AnimeCard 
                      key={item.id}
                      anime={{
                        id: item.anime_id,
                        title: {
                          romaji: item.title || "Titolo non disponibile",
                          english: "",
                          native: "",
                          userPreferred: item.title || "Titolo non disponibile"
                        },
                        coverImage: {
                          large: item.cover_image || "",
                          medium: item.cover_image || ""
                        },
                        format: item.format || "",
                        type: "ANIME",
                        genres: [],
                        bannerImage: null,
                        description: "",
                        episodes: null,
                        chapters: null,
                        averageScore: 0,
                        meanScore: 0,
                        status: "",
                        season: "",
                        seasonYear: 0,
                        startDate: {
                          year: 0,
                          month: 0,
                          day: 0
                        },
                        endDate: {
                          year: 0,
                          month: 0,
                          day: 0
                        },
                        studios: {
                          nodes: []
                        }
                      }}
                    />
                  ))}
                </div>
              </TabsContent>
            ) : null
          )}
        </Tabs>
      ) : (
        <div className="text-center p-12 border rounded-lg">
          <p className="text-muted-foreground mb-4">
            Non hai ancora aggiunto anime alla tua lista.
          </p>
          <a href="/esplora" className="text-anime-primary hover:underline">
            Esplora il catalogo
          </a>
        </div>
      )}
    </div>
  );
};

export default Profile;
