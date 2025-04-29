
import { AnimeMedia } from "@/types/anime";
import { AnimeCard } from "@/components/AnimeCard";
import { Button } from "@/components/ui/button";

interface SearchResultsProps {
  searchTerm: string;
  searchResults: AnimeMedia[];
  onClearSearch: () => void;
}

export const SearchResults = ({ 
  searchTerm, 
  searchResults, 
  onClearSearch 
}: SearchResultsProps) => {
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Risultati per "{searchTerm}"</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onClearSearch}
        >
          Torna all'esplorazione
        </Button>
      </div>
      
      {searchResults.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {searchResults.map((anime) => (
            <AnimeCard key={`search-${anime.id}`} anime={anime} />
          ))}
        </div>
      ) : (
        <p className="text-center py-8 text-muted-foreground">Nessun risultato trovato per "{searchTerm}"</p>
      )}
    </section>
  );
};
