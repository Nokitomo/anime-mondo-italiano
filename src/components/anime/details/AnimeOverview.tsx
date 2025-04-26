
import { AnimeMedia } from "@/types/anime";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AnimeCard } from "@/components/AnimeCard";
import { relationLabels } from "@/types/anime";

interface RelationItem {
  id: number;
  title: AnimeMedia["title"];
  coverImage: AnimeMedia["coverImage"];
  type: string;
  node: AnimeMedia;
  label: string;
}

interface AnimeOverviewProps {
  anime: AnimeMedia;
  description: string;
  relations: RelationItem[];
  recommendations: AnimeMedia[];
}

export function AnimeOverview({ anime, description, relations, recommendations }: AnimeOverviewProps) {
  const hasRelations = relations.length > 0;

  return (
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
              opts={{}}
              orientation="horizontal"
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {relations.map((relation) => (
                  <CarouselItem key={`${relation.id}-${relation.type}`} className="pl-2 md:pl-4 basis-full md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                    <div>
                      <div className="mb-1 px-2 py-0.5 text-xs font-medium inline-flex bg-primary/10 text-primary rounded">
                        {relation.label}
                      </div>
                      <AnimeCard
                        anime={relation.node}
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
              opts={{}}
              orientation="horizontal"
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {recommendations.map((rec) => (
                  <CarouselItem key={rec.id} className="pl-2 md:pl-4 basis-full md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                    <AnimeCard
                      anime={rec}
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
  );
}
