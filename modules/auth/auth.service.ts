import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/auth";
import { authRepository } from "./auth.repository";
import { serializeUser } from "../users/user.serializer";
import type { LoginInput, RegisterInput } from "./auth.schema";
import { AppError } from "@/lib/errors/app-error";

export const authService = {
  async register(input: RegisterInput) {
    const existingUserByEmail = await authRepository.findUserByEmail(
      input.email,
    );

    if (existingUserByEmail) {
      throw new AppError(
        "Já existe um usuário com esse email",
        409,
        "EMAIL_ALREADY_EXISTS",
      );
    }

    const existingUserByCpf = await authRepository.findUserByCpf(input.cpf);

    if (existingUserByCpf) {
      throw new AppError(
        "Já existe um usuário com esse CPF",
        409,
        "CPF_ALREADY_EXISTS",
      );
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
      throw new AppError(
        "Email ou senha inválidos",
        401,
        "INVALID_CREDENTIALS",
      );
    }

    const passwordMatches = await bcrypt.compare(
      input.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new AppError(
        "Email ou senha inválidos",
        401,
        "INVALID_CREDENTIALS",
      );
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
