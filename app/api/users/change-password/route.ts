import { getAuthenticatedUser } from "@/modules/auth/auth.guard";
import { userService } from "@/modules/users/user.service";
import { changePasswordSchema } from "@/modules/users/change-password.schema";
import { handleError } from "@/lib/errors/error-handler";

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);

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

    const result = await userService.changePassword(user.id, parsed.data);

    return Response.json(result);
  } catch (error) {
    return handleError(error);
  }
}
