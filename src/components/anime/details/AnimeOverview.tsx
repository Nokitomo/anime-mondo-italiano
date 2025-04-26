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
import { formatLabels, statusLabels } from "@/types/anime";

interface RelationItem {
  id: number;
  node: AnimeMedia;
  type: string;
  label: string;
}

interface AnimeOverviewProps {
  anime: AnimeMedia;
  description: string;
  relations: RelationItem[];
  recommendations: AnimeMedia[];
}

function seasonToItalian(season: string, year: number) {
  const map: Record<string,string> = {
    SPRING: "Primavera",
    SUMMER: "Estate",
    FALL:   "Autunno",
    WINTER: "Inverno",
  };
  return map[season] ? `${map[season]} ${year}` : `${year}`;
}

export function AnimeOverview({
  anime,
  description,
  relations,
  recommendations,
}: AnimeOverviewProps) {
  // Ordine relazioni già impostato su PREQUEL, SEQUEL, …, ALTERNATIVE, SPIN_OFF, OTHER
  const sortedRelations = [...relations].sort((a, b) => {
    const order = [
      "PREQUEL",
      "SEQUEL",
      "ADAPTATION",
      "SIDE_STORY",
      "CHARACTER",
      "SUMMARY",
      "ALTERNATIVE",
      "SPIN_OFF",
      "OTHER",
    ];
    const ia = order.indexOf(a.type);
    const ib = order.indexOf(b.type);
    return (ia === -1 ? order.length : ia) - (ib === -1 ? order.length : ib);
  });

  return (
    <div className="space-y-8">

      {/* ============= Sinossi ============= */}
      <section className="px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg font-semibold mb-2">Sinossi</h2>
        <p className="text-sm whitespace-pre-line">{description}</p>
      </section>

      {/* ============= Informazioni ============= */}
      <section className="px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg font-semibold mb-4">Informazioni sulla serie</h2>
        <div className="bg-muted/20 dark:bg-muted/30 rounded-lg p-4">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <div>
              <dt className="font-medium">Tipo</dt>
              <dd>{formatLabels[anime.format] || anime.format}</dd>
            </div>
            <div>
              <dt className="font-medium">Episodi</dt>
              <dd>{anime.episodes ?? "—"}</dd>
            </div>
            <div>
              <dt className="font-medium">Capitoli</dt>
              <dd>{anime.chapters ?? "—"}</dd>
            </div>
            <div>
              <dt className="font-medium">Stato</dt>
              <dd>{statusLabels[anime.status as any] || anime.status}</dd>
            </div>
            <div>
              <dt className="font-medium">Data di inizio</dt>
              <dd>
                {anime.startDate.day?.toString().padStart(2, "0") ||
                  "??"}/
                {anime.startDate.month
                  ?.toString()
                  .padStart(2, "0") || "??"}/
                {anime.startDate.year}
              </dd>
            </div>
            <div>
              <dt className="font-medium">Studio</dt>
              <dd>
                {anime.studios?.nodes
                  .map((s) => s.name)
                  .join(", ") || "—"}
              </dd>
            </div>
            <div>
              <dt className="font-medium">Stagione</dt>
              <dd>
                {seasonToItalian(anime.season, anime.seasonYear)}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* ============= Anime Correlati ============= */}
      {sortedRelations.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-semibold mb-4">Anime Correlati</h2>
          <div className="relative">
            <Carousel
              className="w-full"
              opts={{ dragFree: true, align: "start", containScroll: "trimSnaps" }}
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {sortedRelations.map((rel) => (
                  <CarouselItem
                    key={rel.id + rel.type}
                    className="pl-2 md:pl-4 w-1/3"
                  >
                    <Link to={`/anime/${rel.node.id}`}>
                      <div>
                        <div className="mb-1 px-2 py-0.5 text-xs font-medium inline-flex bg-primary/10 text-primary rounded">
                          {rel.label}
                        </div>
                        <AnimeCard anime={rel.node} showBadge={false} />
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

      {/* ============= Anime Consigliati ============= */}
      {recommendations.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-semibold mb-4">Anime Consigliati</h2>
          <div className="relative">
            <Carousel
              className="w-full"
              opts={{ dragFree: true, align: "start", containScroll: "trimSnaps" }}
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