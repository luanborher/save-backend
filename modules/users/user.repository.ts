import { prisma } from "@/lib/prisma";

export const userRepository = {
  //
  // bucar por id, email ou cpf
  //
  //
  findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
    });
  },
  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },
  findByCpf(cpf: string) {
    return prisma.user.findUnique({
      where: { cpf },
    });
  },

  //
  // atualizar por id
  //
  //
  updateById(
    id: number,
    data: {
      name?: string;
      birthDate?: Date;
      phone?: string;
      cpf?: string;
      photo?: string | null;
      email?: string;
    },
  ) {
    return prisma.user.update({
      where: { id },
      data,
    });
  },

  //
  // atualizar senha por id
  //
  //
  updatePasswordById(id: number, passwordHash: string) {
    return prisma.user.update({
      where: { id },
      data: {
        passwordHash,
      },
    });
  },
};
