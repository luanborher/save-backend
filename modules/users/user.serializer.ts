import type { User } from "../../generated/prisma/client";

export function serializeUser(user: User) {
  return {
    id: user.id,
    name: user.name,
    birthDate: user.birthDate,
    phone: user.phone,
    cpf: user.cpf,
    photo: user.photo,
    email: user.email,
  };
}
