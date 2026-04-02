import { handleError } from "@/lib/errors/error-handler";
import { getAuthenticatedUser } from "@/modules/auth/auth.guard";
import { updateListSchema } from "@/modules/lists/list.schema";
import { listService } from "@/modules/lists/list.service";

type Context = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: Request, context: Context) {
  try {
    const user = await getAuthenticatedUser(request);
    const { id } = await context.params;

    const list = await listService.getListById(user.id, Number(id));

    return Response.json(list);
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(request: Request, context: Context) {
  try {
    const user = await getAuthenticatedUser(request);
    const { id } = await context.params;

    const body = await request.json();
    const parsed = updateListSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        {
          error: "Dados inválidos",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const list = await listService.updateList(user.id, Number(id), parsed.data);

    return Response.json({
      message: "Lista atualizada com sucesso",
      list,
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(request: Request, context: Context) {
  try {
    const user = await getAuthenticatedUser(request);
    const { id } = await context.params;

    const result = await listService.deleteList(user.id, Number(id));

    return Response.json(result);
  } catch (error) {
    return handleError(error);
  }
}
