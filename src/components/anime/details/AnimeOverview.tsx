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
import { Link } from "react-router-dom";

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

export function AnimeOverview({
  anime,
  description,
  relations,
  recommendations,
}: AnimeOverviewProps) {
  const hasRelations = relations.length > 0;

  // Ordine desiderato, con ALTERNATIVE_VERSION prima di SPIN_OFF
  const relationOrder = [
    "PREQUEL",
    "SEQUEL",
    "ADAPTATION",
    "SIDE_STORY",
    "CHARACTER",
    "SUMMARY",
    "ALTERNATIVE_VERSION", // ora qui
    "SPIN_OFF",
    "OTHER",
  ];
  const sortedRelations = [...relations].sort((a, b) => {
    const ia = relationOrder.indexOf(a.type);
    const ib = relationOrder.indexOf(b.type);
    const aIndex = ia === -1 ? relationOrder.length : ia;
    const bIndex = ib === -1 ? relationOrder.length : ib;
    return aIndex - bIndex;
  });

  return (
    <div className="space-y-8">
      {/* Sinossi */}
      <section className="prose prose-lg dark:prose-invert max-w-none">
        <h2 className="text-xl font-semibold mb-4">Sinossi</h2>
        <p className="whitespace-pre-line">{description}</p>
      </section>

      {/* Informazioni */}
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
              <dd>{`${anime.startDate.day || "??"}/${
                anime.startDate.month || "??"
              }/${anime.startDate.year}`}</dd>
            </>
          )}
          {anime.studios?.nodes?.length > 0 && (
            <>
              <dt className="font-medium">Studio:</dt>
              <dd>
                {anime.studios.nodes.map((studio) => studio.name).join(", ")}
              </dd>
            </>
          )}
        </dl>
      </section>

      {/* Anime Correlati */}
      {hasRelations && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Anime Correlati</h2>
          <div className="relative">
            <Carousel
              className="w-full"
              opts={{
                dragFree: true,
                align: "start",
                containScroll: "trimSnaps",
              }}
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {sortedRelations.map((relation) => (
                  <CarouselItem
                    key={`${relation.id}-${relation.type}`}
                    className="pl-2 md:pl-4 w-1/3"
                  >
                    <Link to={`/anime/${relation.node.id}`}>
                      <div>
                        <div className="mb-1 px-2 py-0.5 text-xs font-medium inline-flex bg-primary/10 text-primary rounded">
                          {relation.label}
                        </div>
                        <AnimeCard anime={relation.node} showBadge={false} />
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-2 lg:-left-4" />
              <CarouselNext className="-right-2 lg:-right-4" />
            </Carousel>
          </div>
        </section>
      )}

      {/* Anime Consigliati */}
      {recommendations.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Anime Consigliati</h2>
          <div className="relative">
            <Carousel
              className="w-full"
              opts={{
                dragFree: true,
                align: "start",
                containScroll: "trimSnaps",
              }}
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {recommendations.map((rec) => (
                  <CarouselItem
                    key={rec.id}
                    className="pl-2 md:pl-4 w-1/3"
                  >
                    <Link to={`/anime/${rec.id}`}>
                      <AnimeCard anime={rec} showBadge={false} />
                    </Link>
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