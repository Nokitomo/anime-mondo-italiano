
import { AnimeListItem } from "@/services/supabase-service";
import { AnimeMedia } from "@/types/anime";
import { StatusControls } from "./controls/StatusControls";
import { ProgressControls } from "./controls/ProgressControls";
import { ScoreControls } from "./controls/ScoreControls";
import { NotesControls } from "./controls/NotesControls";

interface AnimeListControlsProps {
  anime: AnimeMedia;
  inUserList: AnimeListItem;
  onListUpdate: (item: AnimeListItem) => void;
}

export function AnimeListControls({ anime, inUserList, onListUpdate }: AnimeListControlsProps) {
  return (
    <div className="space-y-4">
      <StatusControls 
        anime={anime} 
        inUserList={inUserList} 
        onListUpdate={onListUpdate} 
      />
      
      <ProgressControls 
        anime={anime} 
        inUserList={inUserList} 
        onListUpdate={onListUpdate} 
      />
      
      <ScoreControls 
        inUserList={inUserList} 
        onListUpdate={onListUpdate} 
      />
      
      <NotesControls 
        inUserList={inUserList} 
        onListUpdate={onListUpdate} 
      />
    </div>
  );
}
