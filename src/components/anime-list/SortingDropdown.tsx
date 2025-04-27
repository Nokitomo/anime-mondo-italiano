
import { SortOption } from "./types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface SortingDropdownProps {
  sortBy: SortOption;
  onSortChange: (option: SortOption) => void;
  sortOptions: SortOption[];
}

export function SortingDropdown({ sortBy, onSortChange, sortOptions }: SortingDropdownProps) {
  return (
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
  );
}
