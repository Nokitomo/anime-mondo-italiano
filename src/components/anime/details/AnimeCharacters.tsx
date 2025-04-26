
import { AnimeMedia } from "@/types/anime";
import { CharacterCard } from "@/components/CharacterCard";

interface AnimeCharactersProps {
  characters: AnimeMedia["characters"]["nodes"];
  characterEdges: AnimeMedia["characters"]["edges"];
}

export function AnimeCharacters({ characters, characterEdges }: AnimeCharactersProps) {
  return (
    <>
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
    </>
  );
}
