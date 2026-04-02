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
    iconNumber?: 1 | 2 | 3 | 4 | 5;
    userId: number;
  }) {
    return prisma.list.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        isGrid: data.isGrid ?? false,
        iconNumber: data.iconNumber ?? 1,
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

  updateById(
    id: number,
    data: {
      name?: string;
      description?: string;
      isGrid?: boolean;
      iconNumber?: 1 | 2 | 3 | 4 | 5;
    },
  ) {
    return prisma.list.update({
      where: { id },
      data,
    });
  },
};
