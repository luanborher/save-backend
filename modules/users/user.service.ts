import bcrypt from "bcryptjs";
import { userRepository } from "./user.repository";
import { serializeUser } from "./user.serializer";
import type { UpdateMeInput } from "./user.schema";
import type { ChangePasswordInput } from "./change-password.schema";
import { AppError } from "@/lib/errors/app-error";

export class UserServiceError extends AppError {
  constructor(message: string, statusCode = 400, code = "USER_ERROR") {
    super(message, statusCode, code);
  }
}

export const userService = {
  async getMe(userId: number) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new UserServiceError(
        "Usuário não encontrado",
        404,
        "USER_NOT_FOUND",
      );
    }

    return serializeUser(user);
  },

  async updateMe(userId: number, input: UpdateMeInput) {
    const currentUser = await userRepository.findById(userId);

    if (!currentUser) {
      throw new UserServiceError(
        "Usuário não encontrado",
        404,
        "USER_NOT_FOUND",
      );
    }

    if (input.email && input.email !== currentUser.email) {
      const existingUserWithEmail = await userRepository.findByEmail(
        input.email,
      );

      if (existingUserWithEmail && existingUserWithEmail.id !== userId) {
        throw new UserServiceError(
          "Email já cadastrado",
          400,
          "EMAIL_ALREADY_EXISTS",
        );
      }
    }

    if (input.cpf && input.cpf !== currentUser.cpf) {
      const existingUserWithCpf = await userRepository.findByCpf(input.cpf);

      if (existingUserWithCpf && existingUserWithCpf.id !== userId) {
        throw new UserServiceError(
          "CPF já cadastrado",
          400,
          "CPF_ALREADY_EXISTS",
        );
      }
    }

    const updatedUser = await userRepository.updateById(userId, {
      name: input.name,
      birthDate: input.birthDate ? new Date(input.birthDate) : undefined,
      phone: input.phone,
      cpf: input.cpf,
      photo: input.photo === "" ? null : input.photo,
      email: input.email,
    });

    return serializeUser(updatedUser);
  },

  async changePassword(userId: number, input: ChangePasswordInput) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new UserServiceError(
        "Usuário não encontrado",
        404,
        "USER_NOT_FOUND",
      );
    }

    const passwordMatches = await bcrypt.compare(
      input.currentPassword,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new UserServiceError(
        "Senha atual incorreta",
        401,
        "INVALID_CURRENT_PASSWORD",
      );
    }

    const newPasswordHash = await bcrypt.hash(input.newPassword, 10);

    await userRepository.updatePasswordById(userId, newPasswordHash);

    return {
      message: "Senha alterada com sucesso",
    };
  },
};
