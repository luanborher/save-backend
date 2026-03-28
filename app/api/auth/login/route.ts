import { loginSchema } from "@/modules/auth/auth.schema";
import { authService } from "@/modules/auth/auth.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        {
          error: "Dados inválidos",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const result = await authService.login(parsed.data);

    return Response.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_CREDENTIALS") {
      return Response.json(
        { error: "Email ou senha inválidos" },
        { status: 401 },
      );
    }

    return Response.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
