import { prisma } from "@/lib/prisma";

export const listRepository = {
  findManyByUserId(userId: number) {
    return prisma.list.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  create(data: {
    name: string;
    description?: string;
    isGrid?: boolean;
    userId: number;
  }) {
    return prisma.list.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        isGrid: data.isGrid ?? false,
        userId: data.userId,
      },
    });
  },

  findByIdAndUserId(id: number, userId: number) {
    return prisma.list.findFirst({
      where: {
        id,
        userId,
      },
    });
  },

  deleteById(id: number) {
    return prisma.list.delete({
      where: { id },
    });
  },
};
