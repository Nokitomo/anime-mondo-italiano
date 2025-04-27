
export interface CharactersData {
  nodes: {
    id: number;
    name: {
      full: string;
      native: string;
    };
    image: {
      medium: string;
      large: string;
    };
    gender: string | null;
    age: string | null;
    description: string | null;
    isFavourite: boolean;
  }[];
  edges: {
    role: string;
    voiceActors: {
      id: number;
      name: {
        full: string;
        native: string;
      };
      image: {
        medium: string;
        large: string;
      };
    }[];
  }[];
}

export interface StaffData {
  edges: {
    role: string;
    node: {
      id: number;
      name: {
        full: string;
        native: string;
      };
      image: {
        medium: string;
        large: string;
      };
    };
  }[];
}
