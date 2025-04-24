
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { translateText } from "@/services/translation-service";
import { AnimeBanner } from "@/components/AnimeBanner";
import { AnimeCard } from "@/components/AnimeCard";
import { CharacterCard, StaffCard } from "@/components/CharacterCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAnimeDetails } from "@/services/anilist-api";
import { AnimeMedia, relationLabels } from "@/types/anime";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { checkAnimeInUserList } from "@/services/supabase-service";

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
      // Controlla se l'anime è nella lista dell'utente per ottenere le note
      checkAnimeInUserList(anime.id).then(listItem => {
        if (listItem?.notes) {
          setUserNotes(listItem.notes);
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
  
  // Ripulire la descrizione da tag HTML
  const cleanDescription = translatedDescription || anime.description || "";
  const description = cleanDescription.replace(/<br\s*\/?>/g, '\n').replace(/<[^>]*>/g, '');
  
  // Organizzare le relazioni per tipo
  const relations = anime.relations?.edges || [];
  
  // Raccomandazioni
  const recommendations = anime.recommendations?.nodes.map(node => node.mediaRecommendation) || [];
  
  // Personaggi
  const characters = anime.characters?.nodes || [];
  const characterEdges = anime.characters?.edges || [];
  
  // Staff
  const staff = anime.staff?.edges || [];
  
  // Controlla se ci sono relazioni
  const hasRelations = relations.length > 0;
  
  return (
    <div>
      <AnimeBanner anime={anime} />
      
      <div className="container py-8">
        {userNotes && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Note personali</h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="whitespace-pre-line">{userNotes}</p>
            </div>
          </div>
        )}
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Panoramica</TabsTrigger>
            <TabsTrigger value="characters">Personaggi</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <div className="space-y-8">
              <section className="prose prose-lg dark:prose-invert max-w-none">
                <h2 className="text-xl font-semibold mb-4">Sinossi</h2>
                <p className="whitespace-pre-line">{description}</p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-4">Informazioni</h2>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
                  {anime.format && (
                    <>
                      <dt className="font-medium">Formato:</dt>
                      <dd>{anime.format}</dd>
                    </>
                  )}
                  {anime.episodes && (
                    <>
                      <dt className="font-medium">Episodi:</dt>
                      <dd>{anime.episodes}</dd>
                    </>
                  )}
                  {anime.chapters && (
                    <>
                      <dt className="font-medium">Capitoli:</dt>
                      <dd>{anime.chapters}</dd>
                    </>
                  )}
                  {anime.status && (
                    <>
                      <dt className="font-medium">Stato:</dt>
                      <dd>{anime.status}</dd>
                    </>
                  )}
                  {anime.startDate?.year && (
                    <>
                      <dt className="font-medium">Data di inizio:</dt>
                      <dd>{`${anime.startDate.day || '??'}/${anime.startDate.month || '??'}/${anime.startDate.year}`}</dd>
                    </>
                  )}
                  {anime.studios?.nodes?.length > 0 && (
                    <>
                      <dt className="font-medium">Studio:</dt>
                      <dd>{anime.studios.nodes.map(studio => studio.name).join(", ")}</dd>
                    </>
                  )}
                </dl>
              </section>
              
              {hasRelations && (
                <section>
                  <h2 className="text-xl font-semibold mb-4">Anime Correlati</h2>
                  <div className="space-y-6">
                    {Object.entries(relationLabels).map(([relationType, label]) => {
                      const filteredRelations = relations.filter(rel => rel.relationType === relationType);
                      
                      if (filteredRelations.length === 0) return null;
                      
                      return (
                        <div key={relationType} className="space-y-3">
                          <h3 className="text-lg font-medium">{label}</h3>
                          <ScrollArea className="w-full whitespace-nowrap">
                            <div className="flex gap-4 pb-4">
                              {filteredRelations.map((rel) => (
                                <div key={rel.node.id} className="w-[180px] shrink-0">
                                  <AnimeCard
                                    anime={rel.node as AnimeMedia}
                                    showBadge={false}
                                  />
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}
              
              {recommendations.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold mb-4">Anime Consigliati</h2>
                  <ScrollArea className="w-full whitespace-nowrap">
                    <div className="flex gap-4 pb-4">
                      {recommendations.map((rec) => (
                        <div key={rec.id} className="w-[180px] shrink-0">
                          <AnimeCard
                            anime={rec as AnimeMedia}
                            showBadge={false}
                          />
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </section>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="characters" className="mt-6">
            {characters.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {characters.map((character, index) => {
                  const edge = characterEdges[index];
                  const voiceActor = edge?.voiceActors?.[0];
                  
                  return (
                    <CharacterCard
                      key={character.id}
                      id={character.id}
                      name={character.name.full}
                      nativeName={character.name.native}
                      image={character.image.medium}
                      role={edge?.role || "Personaggio"}
                      voiceActor={voiceActor ? {
                        id: voiceActor.id,
                        name: voiceActor.name.full,
                        nativeName: voiceActor.name.native,
                        image: voiceActor.image.medium,
                      } : undefined}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-12">
                Nessun personaggio disponibile per questo anime.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="staff" className="mt-6">
            {staff.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {staff.map((staffEdge) => (
                  <StaffCard
                    key={`${staffEdge.node.id}-${staffEdge.role}`}
                    id={staffEdge.node.id}
                    name={staffEdge.node.name.full}
                    nativeName={staffEdge.node.name.native}
                    image={staffEdge.node.image.medium}
                    role={staffEdge.role}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-12">
                Nessun membro dello staff disponibile per questo anime.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AnimeDetailsPage;
