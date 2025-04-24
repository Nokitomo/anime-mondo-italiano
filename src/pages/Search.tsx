
import { useState } from "react";
import { searchAnime } from "@/services/anilist-api";
import { AnimeCard, AnimeCardSkeleton } from "@/components/AnimeCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AnimeMedia } from "@/types/anime";
import { Search } from "lucide-react";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [type, setType] = useState<"ANIME" | "MANGA">("ANIME");
  const [results, setResults] = useState<AnimeMedia[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  
  const handleSearch = async (resetResults = true) => {
    if (!searchTerm.trim()) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const currentPage = resetResults ? 1 : page;
      const response = await searchAnime(searchTerm, currentPage, 24, type);
      
      const newResults = response.data.Page.media;
      
      if (resetResults) {
        setResults(newResults);
        setPage(1);
      } else {
        setResults(prev => [...prev, ...newResults]);
        setPage(currentPage + 1);
      }
      
      setHasNextPage(response.data.Page.pageInfo.hasNextPage);
      setSearched(true);
    } catch (err) {
      console.error("Errore nella ricerca:", err);
      setError("Si è verificato un errore durante la ricerca. Riprova più tardi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Ricerca</h1>
      
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-grow relative">
            <Input 
              placeholder="Cerca anime o manga..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(true);
                }
              }}
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          
          <div className="flex gap-2">
            <Select 
              value={type} 
              onValueChange={(value) => setType(value as "ANIME" | "MANGA")}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ANIME">Anime</SelectItem>
                <SelectItem value="MANGA">Manga</SelectItem>
              </SelectContent>
            </Select>
            
            <Button onClick={() => handleSearch(true)}>
              Cerca
            </Button>
          </div>
        </div>
      </div>
      
      {/* Risultati */}
      {loading && results.length === 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array(12).fill(0).map((_, i) => (
            <AnimeCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <Button variant="outline" onClick={() => handleSearch(true)}>
            Riprova
          </Button>
        </div>
      ) : results.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {results.map(anime => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
          
          {hasNextPage && (
            <div className="mt-8 text-center">
              <Button 
                variant="outline" 
                onClick={() => handleSearch(false)}
                disabled={loading}
              >
                {loading ? "Caricamento..." : "Carica altri"}
              </Button>
            </div>
          )}
        </>
      ) : searched ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nessun risultato trovato per "{searchTerm}"</p>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Inizia a cercare per trovare anime e manga</p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
