import { AppError } from "@/lib/errors/app-error";
import { listRepository } from "./list.repository";
import { serializeList } from "./list.serializer";
import type { CreateListInput } from "./list.schema";

export const listService = {
  async getMyLists(userId: number) {
    const lists = await listRepository.findManyByUserId(userId);
    return lists.map(serializeList);
  },

  async createList(userId: number, input: CreateListInput) {
    const list = await listRepository.create({
      userId,
      name: input.name,
      description: input.description,
      isGrid: input.isGrid,
    });

    return serializeList(list);
  },

  async getListById(userId: number, listId: number) {
    const list = await listRepository.findByIdAndUserId(listId, userId);

    if (!list) {
      throw new AppError("Lista não encontrada", 404, "LIST_NOT_FOUND");
    }

    return serializeList(list);
  },

  async deleteList(userId: number, listId: number) {
    const list = await listRepository.findByIdAndUserId(listId, userId);

    if (!list) {
      throw new AppError("Lista não encontrada", 404, "LIST_NOT_FOUND");
    }

    await listRepository.deleteById(listId);

    return {
      message: "Lista removida com sucesso",
    };
  },
};
