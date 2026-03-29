export function serializeItem(item: {
  id: number;
  name: string;
  status: "PENDING" | "COMPLETED";
  createdAt: Date;
  completedAt: Date | null;
  image: string | null;
  description: string | null;
  highlighted: boolean;
  updatedAt: Date;
  listId: number;
}) {
  return {
    id: item.id,
    name: item.name,
    status: item.status,
    createdAt: item.createdAt,
    completedAt: item.completedAt,
    image: item.image,
    description: item.description,
    highlighted: item.highlighted,
    updatedAt: item.updatedAt,
    listId: item.listId,
  };
}
