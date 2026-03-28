import { handleError } from "@/lib/errors/error-handler";
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
    return handleError(error);
  }
}
