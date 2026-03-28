import { prisma } from "@/lib/prisma";

export const authRepository = {
  findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  findUserByCpf(cpf: string) {
    return prisma.user.findUnique({
      where: { cpf },
    });
  },

  createUser(data: {
    name: string;
    birthDate: Date;
    phone: string;
    cpf: string;
    photo: string | null;
    email: string;
    passwordHash: string;
  }) {
    return prisma.user.create({
      data,
    });
  },
};
