
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  onSearch: (term: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const SearchBar = ({ onSearch, searchTerm, setSearchTerm }: SearchBarProps) => {
  return (
    <div className="mb-8">
      <div className="relative">
        <Input
          placeholder="Cerca anime e manga..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-10"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSearch(searchTerm);
            }
          }}
        />
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-0 top-0 h-full"
          onClick={() => onSearch(searchTerm)}
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
