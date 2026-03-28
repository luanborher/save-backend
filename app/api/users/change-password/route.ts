import { getAuthenticatedUser, AuthError } from "@/modules/auth/auth.guard";
import { userService, UserServiceError } from "@/modules/users/user.service";
import { changePasswordSchema } from "@/modules/users/change-password.schema";

export async function POST(request: Request) {
  try {
    const authenticatedUser = await getAuthenticatedUser(request);

    const body = await request.json();
    const parsed = changePasswordSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        {
          error: "Dados inválidos",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const result = await userService.changePassword(
      authenticatedUser.id,
      parsed.data,
    );

    return Response.json(result);
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.message === "TOKEN_NOT_PROVIDED") {
        return Response.json({ error: "Token não enviado" }, { status: 401 });
      }

      if (error.message === "INVALID_TOKEN_FORMAT") {
        return Response.json(
          { error: "Formato do token inválido" },
          { status: 401 },
        );
      }

      if (error.message === "INVALID_OR_EXPIRED_TOKEN") {
        return Response.json(
          { error: "Token inválido ou expirado" },
          { status: 401 },
        );
      }

      if (error.message === "USER_NOT_FOUND") {
        return Response.json(
          { error: "Usuário não encontrado" },
          { status: 404 },
        );
      }
    }

    if (error instanceof UserServiceError) {
      if (error.message === "USER_NOT_FOUND") {
        return Response.json(
          { error: "Usuário não encontrado" },
          { status: 404 },
        );
      }

      if (error.message === "INVALID_CURRENT_PASSWORD") {
        return Response.json(
          { error: "Senha atual incorreta" },
          { status: 401 },
        );
      }
    }

    return Response.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
