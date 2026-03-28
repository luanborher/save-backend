import { withCors } from "@/lib/cors";
import { handleError } from "@/lib/errors/error-handler";
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

    return withCors(Response.json(result));
  } catch (error) {
    return withCors(handleError(error));
  }
}
