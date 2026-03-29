import { z } from "zod";

export const createListSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  isGrid: z.boolean().optional(),
});

export type CreateListInput = z.infer<typeof createListSchema>;
