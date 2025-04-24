
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function AnimeListEmpty() {
  return (
    <div className="text-center py-12">
      <p className="text-muted-foreground mb-4">
        Non hai ancora aggiunto anime a questa lista.
      </p>
      <Button asChild>
        <Link to="/esplora">Esplora anime</Link>
      </Button>
    </div>
  );
}
