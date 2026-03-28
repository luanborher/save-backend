import { getAuthenticatedUser } from "@/modules/auth/auth.guard";
import { userService } from "@/modules/users/user.service";
import { updateMeSchema } from "@/modules/users/user.schema";
import { handleError } from "@/lib/errors/error-handler";

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    const me = await userService.getMe(user.id);

    return Response.json(me);
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
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

    const updated = await userService.updateMe(user.id, parsed.data);

    return Response.json({
      message: "Usuário atualizado com sucesso",
      user: updated,
    });
  } catch (error) {
    return handleError(error);
  }
}
