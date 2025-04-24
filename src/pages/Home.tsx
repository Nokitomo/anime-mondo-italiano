
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTrendingAnime } from "@/services/anilist-api";
import { AnimeCard, AnimeCardSkeleton } from "@/components/AnimeCard";
import { Button } from "@/components/ui/button";
import { AnimeMedia } from "@/types/anime";

const Home = () => {
  const [trendingAnime, setTrendingAnime] = useState<AnimeMedia[]>([]);
  const [popularAnime, setPopularAnime] = useState<AnimeMedia[]>([]);
  const [upcomingAnime, setUpcomingAnime] = useState<AnimeMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchAnime = async () => {
      try {
        setLoading(true);
        const data = await getTrendingAnime();
        
        setTrendingAnime(data.data.trending.media);
        setPopularAnime(data.data.popular.media);
        setUpcomingAnime(data.data.upcoming.media);
        
        setLoading(false);
      } catch (err) {
        console.error("Errore nel recupero degli anime:", err);
        setError("Si è verificato un errore nel caricamento degli anime.");
        setLoading(false);
      }
    };
    
    fetchAnime();
  }, []);
  
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array(6).fill(0).map((_, i) => (
        <AnimeCardSkeleton key={i} />
      ))}
    </div>
  );

  return (
    <div className="pb-12">
      {/* Hero Banner */}
      <div className="relative bg-anime-primary/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-anime-primary/20 to-transparent"></div>
        <div className="container py-12 lg:py-24 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">
              Benvenuto su <span className="text-anime-primary">AnimeIT</span>
            </h1>
            <p className="text-lg opacity-90 mb-6 animate-fade-in" style={{ animationDelay: "150ms" }}>
              La tua piattaforma italiana per gestire e scoprire anime e manga.
              Crea la tua lista personalizzata e tieni traccia di tutto ciò che guardi.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: "300ms" }}>
              <Link to="/esplora">
                <Button className="bg-anime-primary hover:bg-anime-primary/90">
                  Esplora il catalogo
                </Button>
              </Link>
              <Link to="/registrazione">
                <Button variant="outline">
                  Crea un account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container py-12 space-y-12">
        {/* Sezione Anime di tendenza */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Di tendenza</h2>
            <Link to="/esplora?sort=trending">
              <Button variant="link" className="text-anime-primary">
                Vedi tutti
              </Button>
            </Link>
          </div>
          
          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">{error}</p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Riprova
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {trendingAnime.map(anime => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>
          )}
        </section>
        
        {/* Sezione Anime popolari */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Popolari</h2>
            <Link to="/esplora?sort=popular">
              <Button variant="link" className="text-anime-primary">
                Vedi tutti
              </Button>
            </Link>
          </div>
          
          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {popularAnime.map(anime => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>
          )}
        </section>
        
        {/* Sezione Anime in arrivo */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">In arrivo</h2>
            <Link to="/esplora?status=not_yet_released">
              <Button variant="link" className="text-anime-primary">
                Vedi tutti
              </Button>
            </Link>
          </div>
          
          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {upcomingAnime.map(anime => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
