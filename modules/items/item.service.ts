import { AppError } from "@/lib/errors/app-error";
import { listRepository } from "@/modules/lists/list.repository";
import { itemRepository } from "./item.repository";
import { serializeItem } from "./item.serializer";
import type { CreateItemInput } from "./item.schema";

export const itemService = {
  async getItemsFromList(userId: number, listId: number) {
    const list = await listRepository.findByIdAndUserId(listId, userId);

    if (!list) {
      throw new AppError("Lista não encontrada", 404, "LIST_NOT_FOUND");
    }

    const items = await itemRepository.findManyByListId(listId);
    return items.map(serializeItem);
  },

  async createItem(userId: number, listId: number, input: CreateItemInput) {
    const list = await listRepository.findByIdAndUserId(listId, userId);

    if (!list) {
      throw new AppError("Lista não encontrada", 404, "LIST_NOT_FOUND");
    }

    const item = await itemRepository.create({
      listId,
      name: input.name,
      description: input.description,
      image: input.image === "" ? null : input.image,
      highlighted: input.highlighted,
    });

    return serializeItem(item);
  },

  async deleteItem(userId: number, itemId: number) {
    const item = await itemRepository.findById(itemId);

    if (!item || item.list.userId !== userId) {
      throw new AppError("Item não encontrado", 404, "ITEM_NOT_FOUND");
    }

    await itemRepository.deleteById(itemId);

    return {
      message: "Item removido com sucesso",
    };
  },

  async toggleItemStatus(userId: number, itemId: number) {
    const item = await itemRepository.findById(itemId);

    if (!item || item.list.userId !== userId) {
      throw new AppError("Item não encontrado", 404, "ITEM_NOT_FOUND");
    }

    const nextStatus = item.status === "PENDING" ? "COMPLETED" : "PENDING";

    const updatedItem = await itemRepository.updateStatusById(itemId, {
      status: nextStatus,
      completedAt: nextStatus === "COMPLETED" ? new Date() : null,
    });

    return serializeItem(updatedItem);
  },
};
