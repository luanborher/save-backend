import { z } from "zod";

export const createItemSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  image: z
    .string()
    .url("Imagem deve ser uma URL válida")
    .optional()
    .or(z.literal("")),
  highlighted: z.boolean().optional(),
});

export type CreateItemInput = z.infer<typeof createItemSchema>;
