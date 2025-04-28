
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { translateText } from "@/services/translation-service";
import { AnimeBanner } from "@/components/AnimeBanner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAnimeDetails } from "@/services/anilist";
import { relationLabels, AnimeMedia } from "@/types/anime";
import { useQuery } from "@tanstack/react-query";
import { checkAnimeInUserList } from "@/services/supabase-service";
import { AnimeOverview } from "@/components/anime/details/AnimeOverview";
import { AnimeCharacters } from "@/components/anime/details/AnimeCharacters";
import { AnimeStaff } from "@/components/anime/details/AnimeStaff";

const AnimeDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [translatedDescription, setTranslatedDescription] = useState<string>("");
  const [userNotes, setUserNotes] = useState<string>("");
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["animeDetails", id],
    queryFn: () => getAnimeDetails(parseInt(id || "0")),
    enabled: !!id,
  });
  
  const anime = data?.data?.Media;
  
  useEffect(() => {
    const translateDescription = async () => {
      if (anime?.description) {
        try {
          const translated = await translateText(anime.description);
          setTranslatedDescription(translated);
        } catch (err) {
          console.error("Errore nella traduzione della descrizione:", err);
          setTranslatedDescription(anime.description);
        }
      }
    };
    
    if (anime) {
      translateDescription();
      checkAnimeInUserList(anime.id).then(listItem => {
        if (listItem?.notes) {
          setUserNotes(listItem.notes);
        } else {
          setUserNotes("");
        }
      });
    }
  }, [anime]);
  
  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="animate-pulse">
          <div className="h-64 bg-muted rounded-lg mb-6"></div>
          <div className="h-10 bg-muted rounded-md w-2/3 mb-4"></div>
          <div className="h-6 bg-muted rounded-md w-1/2 mb-8"></div>
          <div className="h-4 bg-muted rounded-md mb-3"></div>
          <div className="h-4 bg-muted rounded-md mb-3 w-11/12"></div>
          <div className="h-4 bg-muted rounded-md mb-3 w-10/12"></div>
          <div className="h-4 bg-muted rounded-md mb-3 w-9/12"></div>
        </div>
      </div>
    );
  }
  
  if (error || !anime) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Errore</h1>
        <p className="text-red-600 mb-6">{error ? (error as Error).message : "Anime non trovato"}</p>
        <a href="/" className="text-anime-primary hover:underline">
          Torna alla home
        </a>
      </div>
    );
  }
  
  const cleanDescription = translatedDescription || anime.description || "";
  const description = cleanDescription.replace(/<br\s*\/?>/g, '\n').replace(/<[^>]*>/g, '');
  
  const relations = anime.relations?.edges || [];
  const recommendations = anime.recommendations?.nodes.map(node => node.mediaRecommendation) || [];
  const characters = anime.characters?.nodes || [];
  const characterEdges = anime.characters?.edges || [];
  const staff = anime.staff?.edges || [];
  
  // Create properly formatted relation items with full AnimeMedia objects
  const formattedRelations = relations.map(rel => ({
    id: rel.node.id,
    title: rel.node.title,
    coverImage: rel.node.coverImage,
    type: rel.relationType,
    node: rel.node as AnimeMedia, // Cast to AnimeMedia
    label: relationLabels[rel.relationType] || rel.relationType
  }));
  
  return (
    <div>
      <AnimeBanner anime={anime} />
      
      <div className="container py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Note personali</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none bg-muted/20 p-4 rounded-md">
            {userNotes ? (
              <p className="whitespace-pre-line">{userNotes}</p>
            ) : (
              <p className="text-muted-foreground italic">Nessuna nota personale. Puoi aggiungerne una nelle opzioni qui sopra.</p>
            )}
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Panoramica</TabsTrigger>
            <TabsTrigger value="characters">Personaggi</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <AnimeOverview
              anime={anime}
              description={description}
              relations={formattedRelations}
              recommendations={recommendations as AnimeMedia[]}
            />
          </TabsContent>
          
          <TabsContent value="characters" className="mt-6">
            <AnimeCharacters
              characters={characters}
              characterEdges={characterEdges}
            />
          </TabsContent>
          
          <TabsContent value="staff" className="mt-6">
            <AnimeStaff staff={staff} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AnimeDetailsPage;
