import { AppError } from "@/lib/errors/app-error";
import { listRepository } from "./list.repository";
import { serializeList } from "./list.serializer";
import type { CreateListInput, UpdateListInput } from "./list.schema";

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
      iconNumber: input.iconNumber,
    });

    return serializeList(list);
  },

  async updateList(userId: number, listId: number, input: UpdateListInput) {
    const list = await listRepository.findByIdAndUserId(listId, userId);

    if (!list) {
      throw new AppError("Lista não encontrada", 404, "LIST_NOT_FOUND");
    }

    const updatedList = await listRepository.updateById(listId, {
      name: input.name,
      description: input.description,
      isGrid: input.isGrid,
      iconNumber: input.iconNumber,
    });

    return serializeList(updatedList);
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
