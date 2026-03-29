import { handleError } from "@/lib/errors/error-handler";
import { getAuthenticatedUser } from "@/modules/auth/auth.guard";
import { itemService } from "@/modules/items/item.service";

type Context = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(request: Request, context: Context) {
  try {
    const user = await getAuthenticatedUser(request);
    const { id } = await context.params;

    const result = await itemService.deleteItem(user.id, Number(id));

    return Response.json(result);
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(request: Request, context: Context) {
  try {
    const user = await getAuthenticatedUser(request);
    const { id } = await context.params;

    const item = await itemService.toggleItemStatus(user.id, Number(id));

    return Response.json({
      message: "Status do item atualizado com sucesso",
      item,
    });
  } catch (error) {
    return handleError(error);
  }
}
