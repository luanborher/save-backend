import { handleError } from "@/lib/errors/error-handler";
import { getAuthenticatedUser } from "@/modules/auth/auth.guard";
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
