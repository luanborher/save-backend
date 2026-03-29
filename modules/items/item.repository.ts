import { prisma } from "@/lib/prisma";

export const itemRepository = {
  findManyByListId(listId: number) {
    return prisma.listItem.findMany({
      where: { listId },
      orderBy: { createdAt: "desc" },
    });
  },

  create(data: {
    name: string;
    description?: string;
    image?: string | null;
    highlighted?: boolean;
    listId: number;
  }) {
    return prisma.listItem.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        image: data.image ?? null,
        highlighted: data.highlighted ?? false,
        listId: data.listId,
      },
    });
  },

  findById(id: number) {
    return prisma.listItem.findUnique({
      where: { id },
      include: {
        list: true,
      },
    });
  },

  deleteById(id: number) {
    return prisma.listItem.delete({
      where: { id },
    });
  },

  updateStatusById(
    id: number,
    data: {
      status: "PENDING" | "COMPLETED";
      completedAt: Date | null;
    },
  ) {
    return prisma.listItem.update({
      where: { id },
      data,
    });
  },
};
