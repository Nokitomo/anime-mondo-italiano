
import { MoreHorizontal, Trash2, PenLine } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface AnimeBannerActionsProps {
  onRemoveClick: () => void;
  onEditNotes: () => void;
}

export function AnimeBannerActions({ onRemoveClick, onEditNotes }: AnimeBannerActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-700/50">
        <MoreHorizontal className="h-5 w-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEditNotes}>
          <PenLine className="h-4 w-4 mr-2" />
          Modifica note
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-destructive focus:text-destructive"
          onClick={onRemoveClick}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Rimuovi dalla lista
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
