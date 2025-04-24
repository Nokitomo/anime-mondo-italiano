
import { Card, CardContent } from "@/components/ui/card";

interface CharacterProps {
  id: number;
  name: string;
  nativeName: string;
  image: string;
  role: string;
  voiceActor?: {
    id: number;
    name: string;
    nativeName: string;
    image: string;
  };
}

export function CharacterCard({ name, nativeName, image, role, voiceActor }: CharacterProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 relative">
          <img 
            src={image} 
            alt={name} 
            className="w-full aspect-square object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm py-1 px-2 text-xs font-medium">
            {role}
          </div>
        </div>
        
        {voiceActor && (
          <div className="w-full md:w-1/2 relative">
            <img 
              src={voiceActor.image} 
              alt={voiceActor.name} 
              className="w-full aspect-square object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm py-1 px-2 text-xs font-medium">
              Doppiatore
            </div>
          </div>
        )}
      </div>
      
      <CardContent className="p-3 flex-grow">
        <div className="space-y-1">
          <p className="font-semibold text-sm line-clamp-1">{name}</p>
          {nativeName && (
            <p className="text-xs text-muted-foreground line-clamp-1">{nativeName}</p>
          )}
          
          {voiceActor && (
            <div className="pt-1 mt-2 border-t border-muted">
              <p className="font-semibold text-xs line-clamp-1">{voiceActor.name}</p>
              {voiceActor.nativeName && (
                <p className="text-xs text-muted-foreground line-clamp-1">{voiceActor.nativeName}</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function StaffCard({ name, nativeName, image, role }: Omit<CharacterProps, 'voiceActor'>) {
  return (
    <Card className="overflow-hidden h-full">
      <div className="relative">
        <img 
          src={image} 
          alt={name} 
          className="w-full aspect-square object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm py-1 px-2 text-xs font-medium">
          {role}
        </div>
      </div>
      
      <CardContent className="p-3">
        <div className="space-y-1">
          <p className="font-semibold text-sm line-clamp-1">{name}</p>
          {nativeName && (
            <p className="text-xs text-muted-foreground line-clamp-1">{nativeName}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
