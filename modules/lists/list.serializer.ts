type SerializedList = {
  id: number;
  name: string;
  description: string | null;
  isGrid: boolean;
  iconNumber: number;
  createdAt: Date;
  updatedAt: Date;
};

export function serializeList(list: {
  id: number;
  name: string;
  description: string | null;
  isGrid: boolean;
  iconNumber: number;
  createdAt: Date;
  updatedAt: Date;
}): SerializedList {
  return {
    id: list.id,
    name: list.name,
    description: list.description,
    isGrid: list.isGrid,
    iconNumber: list.iconNumber,
    createdAt: list.createdAt,
    updatedAt: list.updatedAt,
  };
}
