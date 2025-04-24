
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Filter, Plus } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuRadioGroup, 
  DropdownMenuRadioItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { SortOption } from "./types";

interface AnimeListHeaderProps {
  sortBy: SortOption;
  onSortChange: (option: SortOption) => void;
  sortOptions: SortOption[];
}

export function AnimeListHeader({ sortBy, onSortChange, sortOptions }: AnimeListHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <h1 className="text-3xl font-bold">Le mie liste</h1>
      
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <Filter className="h-4 w-4 mr-1" />
              Ordina: {sortBy.label}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuRadioGroup 
              value={`${sortBy.field}-${sortBy.direction}`} 
              onValueChange={(value) => {
                const [field, direction] = value.split('-') as [string, 'asc' | 'desc'];
                const option = sortOptions.find(o => o.field === field && o.direction === direction);
                if (option) onSortChange(option);
              }}
            >
              {sortOptions.map((option) => (
                <DropdownMenuRadioItem 
                  key={`${option.field}-${option.direction}`} 
                  value={`${option.field}-${option.direction}`}
                >
                  {option.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button asChild variant="default">
          <Link to="/esplora">
            <Plus className="h-4 w-4 mr-1" />
            Aggiungi anime
          </Link>
        </Button>
      </div>
    </div>
  );
}
