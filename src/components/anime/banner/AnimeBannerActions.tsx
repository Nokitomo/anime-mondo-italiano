
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
  isProcessing: boolean;
}

export function AnimeBannerActions({ onRemoveClick, onEditNotes, isProcessing }: AnimeBannerActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger 
        className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-800/70 hover:bg-gray-700 focus:outline-none"
        disabled={isProcessing}
      >
        <MoreHorizontal className="h-5 w-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-popover/95 backdrop-blur-sm border-gray-700 z-50">
        <DropdownMenuItem 
          onClick={onEditNotes} 
          className="cursor-pointer"
          disabled={isProcessing}
        >
          <PenLine className="h-4 w-4 mr-2" />
          Modifica note
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-destructive focus:text-destructive cursor-pointer"
          onClick={onRemoveClick}
          disabled={isProcessing}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Rimuovi dalla lista
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
