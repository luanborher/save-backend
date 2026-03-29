import { handleError } from "@/lib/errors/error-handler";
import { getAuthenticatedUser } from "@/modules/auth/auth.guard";
import { itemService } from "@/modules/items/item.service";
import { createItemSchema } from "@/modules/items/item.schema";

type Context = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: Request, context: Context) {
  try {
    const user = await getAuthenticatedUser(request);
    const { id } = await context.params;

    const items = await itemService.getItemsFromList(user.id, Number(id));

    return Response.json(items);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request, context: Context) {
  try {
    const user = await getAuthenticatedUser(request);
    const { id } = await context.params;

    const body = await request.json();
    const parsed = createItemSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        {
          error: "Dados inválidos",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const item = await itemService.createItem(user.id, Number(id), parsed.data);

    return Response.json(
      {
        message: "Item criado com sucesso",
        item,
      },
      { status: 201 },
    );
  } catch (error) {
    return handleError(error);
  }
}
