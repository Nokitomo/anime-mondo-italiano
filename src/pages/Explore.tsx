
import { useState } from "react";
import { AnimeCard, AnimeCardSkeleton } from "@/components/AnimeCard";
import { useQuery } from "@tanstack/react-query";
import { getTrendingAnime } from "@/services/anilist-api";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Explore = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["trendingAnime"],
    queryFn: getTrendingAnime
  });

  if (isLoading) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Esplora</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array(12).fill(0).map((_, i) => (
            <AnimeCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Esplora</h1>
        <p className="text-red-600 mb-4">Si è verificato un errore nel caricamento degli anime.</p>
        <Button variant="outline">Riprova</Button>
      </div>
    );
  }

  const { trending, popular, upcoming } = data.data;

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Esplora</h1>
      
      <Tabs defaultValue="trending" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="trending">In tendenza</TabsTrigger>
          <TabsTrigger value="popular">Popolari</TabsTrigger>
          <TabsTrigger value="upcoming">In arrivo</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trending">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {trending.media.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="popular">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {popular.media.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="upcoming">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {upcoming.media.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Explore;
