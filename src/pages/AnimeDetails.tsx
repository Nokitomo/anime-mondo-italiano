
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AnimeMedia } from "@/types/anime";
import { translateText } from "@/services/translation-service";
import { AnimeBanner } from "@/components/AnimeBanner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AnimeDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [anime, setAnime] = useState<AnimeMedia | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [translatedDescription, setTranslatedDescription] = useState<string>("");
  
  useEffect(() => {
    const fetchAnimeDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const query = `
          query ($id: Int) {
            Media(id: $id) {
              id
              title {
                romaji
                english
                native
                userPreferred
              }
              coverImage {
                large
                medium
              }
              bannerImage
              description
              episodes
              chapters
              genres
              averageScore
              meanScore
              format
              status
              season
              seasonYear
              startDate {
                year
                month
                day
              }
              endDate {
                year
                month
                day
              }
              studios {
                nodes {
                  id
                  name
                }
              }
              type
            }
          }
        `;
        
        const response = await fetch("https://graphql.anilist.co", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            query,
            variables: { id: parseInt(id) },
          }),
        });
        
        const data = await response.json();
        
        if (data.errors) {
          throw new Error(data.errors[0].message);
        }
        
        setAnime(data.data.Media);
        
        // Tenta di tradurre la descrizione
        if (data.data.Media.description) {
          const translated = await translateText(data.data.Media.description);
          setTranslatedDescription(translated);
        }
        
      } catch (err) {
        console.error("Errore nel recupero dei dettagli dell'anime:", err);
        setError("Si è verificato un errore nel caricamento dei dettagli. Riprova più tardi.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnimeDetails();
  }, [id]);
  
  if (loading) {
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
        <p className="text-red-600 mb-6">{error || "Anime non trovato"}</p>
        <a href="/" className="text-anime-primary hover:underline">
          Torna alla home
        </a>
      </div>
    );
  }
  
  // Ripulire la descrizione da tag HTML
  const cleanDescription = translatedDescription || anime.description || "";
  const description = cleanDescription.replace(/<br\s*\/?>/g, '\n').replace(/<[^>]*>/g, '');
  
  return (
    <div>
      <AnimeBanner anime={anime} />
      
      <div className="container py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
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
            </div>
          </TabsContent>
          
          <TabsContent value="characters" className="mt-6">
            <div className="text-center text-muted-foreground py-12">
              I personaggi saranno disponibili presto.
            </div>
          </TabsContent>
          
          <TabsContent value="staff" className="mt-6">
            <div className="text-center text-muted-foreground py-12">
              Lo staff sarà disponibile presto.
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AnimeDetailsPage;
