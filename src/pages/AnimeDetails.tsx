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
import { checkAnimeInUserList } from "@/services/supabase-service";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
  
  const hasRelations = relations.length > 0;
  
  const formattedRelations = relations.map(rel => ({
    id: rel.node.id,
    title: rel.node.title,
    coverImage: rel.node.coverImage,
    type: rel.relationType,
    node: rel.node,
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
                  <div className="relative">
                    <Carousel
                      opts={{
                        align: "start",
                        slidesToScroll: 1
                      }}
                      className="w-full"
                    >
                      <CarouselContent className="-ml-2 md:-ml-4">
                        {formattedRelations.map((relation) => (
                          <CarouselItem key={`${relation.id}-${relation.type}`} className="pl-2 md:pl-4 basis-full md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                            <div>
                              <div className="mb-1 px-2 py-0.5 text-xs font-medium inline-flex bg-primary/10 text-primary rounded">
                                {relation.label}
                              </div>
                              <AnimeCard
                                anime={relation.node as AnimeMedia}
                                showBadge={false}
                              />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="-left-2 lg:-left-4" />
                      <CarouselNext className="-right-2 lg:-right-4" />
                    </Carousel>
                  </div>
                </section>
              )}
              
              {recommendations.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold mb-4">Anime Consigliati</h2>
                  <div className="relative">
                    <Carousel
                      opts={{
                        align: "start",
                        slidesToScroll: 1
                      }}
                      className="w-full"
                    >
                      <CarouselContent className="-ml-2 md:-ml-4">
                        {recommendations.map((rec) => (
                          <CarouselItem key={rec.id} className="pl-2 md:pl-4 basis-full md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                            <AnimeCard
                              anime={rec as AnimeMedia}
                              showBadge={false}
                            />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="-left-2 lg:-left-4" />
                      <CarouselNext className="-right-2 lg:-right-4" />
                    </Carousel>
                  </div>
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
