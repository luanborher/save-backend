import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/auth";
import { authRepository } from "./auth.repository";
import { serializeUser } from "../users/user.serializer";
import type { LoginInput, RegisterInput } from "./auth.schema";

export const authService = {
  async register(input: RegisterInput) {
    const existingUserByEmail = await authRepository.findUserByEmail(
      input.email,
    );

    if (existingUserByEmail) {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }

    const existingUserByCpf = await authRepository.findUserByCpf(input.cpf);

    if (existingUserByCpf) {
      throw new Error("CPF_ALREADY_EXISTS");
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    const user = await authRepository.createUser({
      name: input.name,
      birthDate: new Date(input.birthDate),
      phone: input.phone,
      cpf: input.cpf,
      photo: input.photo || null,
      email: input.email,
      passwordHash,
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    return {
      message: "Usuário cadastrado com sucesso",
      token,
      user: serializeUser(user),
    };
  },

  async login(input: LoginInput) {
    const user = await authRepository.findUserByEmail(input.email);

    if (!user) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const passwordMatches = await bcrypt.compare(
      input.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    return {
      message: "Login realizado com sucesso",
      token,
      user: serializeUser(user),
    };
  },
};
