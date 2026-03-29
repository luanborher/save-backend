import { handleError } from "@/lib/errors/error-handler";
import { getAuthenticatedUser } from "@/modules/auth/auth.guard";
import { createListSchema } from "@/modules/lists/list.schema";
import { listService } from "@/modules/lists/list.service";

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    const lists = await listService.getMyLists(user.id);

    return Response.json(lists);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    const body = await request.json();
    const parsed = createListSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        {
          error: "Dados inválidos",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const list = await listService.createList(user.id, parsed.data);

    return Response.json(
      {
        message: "Lista criada com sucesso",
        list,
      },
      { status: 201 },
    );
  } catch (error) {
    return handleError(error);
  }
}
