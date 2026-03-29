type SerializedList = {
  id: number;
  name: string;
  description: string | null;
  isGrid: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export function serializeList(list: {
  id: number;
  name: string;
  description: string | null;
  isGrid: boolean;
  createdAt: Date;
  updatedAt: Date;
}): SerializedList {
  return {
    id: list.id,
    name: list.name,
    description: list.description,
    isGrid: list.isGrid,
    createdAt: list.createdAt,
    updatedAt: list.updatedAt,
  };
}
