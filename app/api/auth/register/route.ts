import { registerSchema } from "@/modules/auth/auth.schema";
import { authService } from "@/modules/auth/auth.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        {
          error: "Dados inválidos",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const result = await authService.register(parsed.data);

    return Response.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
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
