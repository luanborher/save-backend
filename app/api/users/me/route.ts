import { getAuthenticatedUser, AuthError } from "@/modules/auth/auth.guard";
import { userService, UserServiceError } from "@/modules/users/user.service";
import { updateMeSchema } from "@/modules/users/user.schema";

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);

    const me = await userService.getMe(user.id);

    return Response.json(me);
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
    }

    return Response.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const authenticatedUser = await getAuthenticatedUser(request);

    const body = await request.json();
    const parsed = updateMeSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        {
          error: "Dados inválidos",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const updatedUser = await userService.updateMe(
      authenticatedUser.id,
      parsed.data,
    );

    return Response.json({
      message: "Usuário atualizado com sucesso",
      user: updatedUser,
    });
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

      if (error.message === "EMAIL_ALREADY_EXISTS") {
        return Response.json(
          { error: "Já existe um usuário com esse email" },
          { status: 409 },
        );
      }

      if (error.message === "CPF_ALREADY_EXISTS") {
        return Response.json(
          { error: "Já existe um usuário com esse CPF" },
          { status: 409 },
        );
      }
    }

    return Response.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
