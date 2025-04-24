
import { AnimeMedia } from "@/types/anime";

interface AnimeTitleProps {
  title: AnimeMedia["title"];
}

export const AnimeTitle = ({ title }: AnimeTitleProps) => {
  return (
    <div>
      <h1 className="text-xl md:text-3xl font-bold mb-2">
        {title.userPreferred || title.romaji}
      </h1>
      {title.native && (
        <p className="text-sm opacity-80 mb-2">{title.native}</p>
      )}
    </div>
  );
};
