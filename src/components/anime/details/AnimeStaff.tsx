
import { AnimeMedia } from "@/types/anime";
import { StaffCard } from "@/components/CharacterCard";

interface AnimeStaffProps {
  staff: AnimeMedia["staff"]["edges"];
}

export function AnimeStaff({ staff }: AnimeStaffProps) {
  return (
    <>
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
    </>
  );
}
