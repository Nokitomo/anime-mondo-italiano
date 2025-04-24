
import { useState } from "react";
import { AnimeMedia, statusLabels, AnimeStatus, formatLabels } from "@/types/anime";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { addAnimeToList } from "@/services/supabase-service";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle } from "lucide-react";

interface AnimeBannerProps {
  anime: AnimeMedia;
}

export function AnimeBanner({ anime }: AnimeBannerProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [status, setStatus] = useState<AnimeStatus>("IN_CORSO");
  const [progress, setProgress] = useState("0");
  const [score, setScore] = useState("0");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatType = formatLabels[anime.format] || anime.format;
  const studios = anime.studios?.nodes?.map(studio => studio.name).join(", ") || "Studio non disponibile";
  
  // Formattare la data di inizio
  const startDate = anime.startDate?.year 
    ? `${anime.startDate.month || '??'}.${anime.startDate.year}` 
    : 'Data sconosciuta';

  const handleAddToList = async () => {
    if (!user) {
      toast({
        title: "Accesso richiesto",
        description: "Devi accedere per aggiungere anime alla tua lista.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await addAnimeToList(
        anime.id,
        status,
        parseInt(progress) || 0,
        parseInt(score) || 0,
        notes
      );
      
      toast({
        title: "Aggiunto con successo",
        description: `${anime.title.userPreferred || anime.title.romaji} è stato aggiunto alla tua lista.`,
      });
      
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error("Errore nell'aggiunta dell'anime alla lista:", error);
      toast({
        title: "Errore",
        description: error.message || "Impossibile aggiungere l'anime alla lista.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="relative overflow-hidden bg-black text-white">
      {anime.bannerImage && (
        <div className="absolute inset-0 opacity-20">
          <img 
            src={anime.bannerImage} 
            alt={anime.title.romaji} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        </div>
      )}
      
      <div className="container relative z-10 py-8 md:py-12">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="shrink-0 w-32 md:w-48">
            <img 
              src={anime.coverImage.large} 
              alt={anime.title.romaji} 
              className="w-full rounded-md shadow-lg"
            />
          </div>
          
          <div className="space-y-4">
            <div>
              <h1 className="text-xl md:text-3xl font-bold mb-2">
                {anime.title.userPreferred || anime.title.romaji}
              </h1>
              {anime.title.native && (
                <p className="text-sm opacity-80 mb-2">{anime.title.native}</p>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-white/10 backdrop-blur-sm">
                {anime.type === "ANIME" ? formatType : "Manga"}
              </Badge>
              {anime.episodes && (
                <Badge variant="outline" className="bg-white/10 backdrop-blur-sm">
                  {anime.episodes} episodi
                </Badge>
              )}
              {anime.averageScore > 0 && (
                <Badge variant="outline" className="bg-white/10 backdrop-blur-sm">
                  ⭐ {anime.averageScore}%
                </Badge>
              )}
            </div>
            
            <div className="text-sm">
              <p className="mb-1"><span className="opacity-70">Studio:</span> {studios}</p>
              <p><span className="opacity-70">Anno:</span> {startDate}</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {anime.genres?.map((genre, index) => (
                <Badge key={index} variant="secondary" className="bg-anime-primary/90">
                  {genre}
                </Badge>
              ))}
            </div>
            
            <div className="flex gap-2 pt-2">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-anime-primary hover:bg-anime-primary/90">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Aggiungi alla lista
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Aggiungi alla tua lista</DialogTitle>
                    <DialogDescription>
                      Aggiungi "{anime.title.userPreferred || anime.title.romaji}" alla tua lista personale.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="status">Stato</Label>
                      <Select
                        value={status}
                        onValueChange={(value) => setStatus(value as AnimeStatus)}
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Seleziona uno stato" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(statusLabels).map(([key, label]) => (
                            <SelectItem key={key} value={key}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="progress">Progresso {anime.episodes ? `(max ${anime.episodes})` : ''}</Label>
                      <Input
                        id="progress"
                        type="number"
                        min="0"
                        max={anime.episodes || undefined}
                        value={progress}
                        onChange={(e) => setProgress(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="score">Voto (0-10)</Label>
                      <Input
                        id="score"
                        type="number"
                        min="0"
                        max="10"
                        step="0.5"
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes">Note</Label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Aggiungi note personali..."
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                      disabled={isSubmitting}
                    >
                      Annulla
                    </Button>
                    <Button 
                      onClick={handleAddToList}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Aggiunta in corso..." : "Aggiungi"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
