import { z } from "zod";

const iconNumberSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]);

export const createListSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  isGrid: z.boolean().optional(),
  iconNumber: iconNumberSchema.optional(),
});

export type CreateListInput = z.infer<typeof createListSchema>;

export const updateListSchema = z
  .object({
    name: z.string().min(1, "Nome é obrigatório").optional(),
    description: z.string().optional(),
    isGrid: z.boolean().optional(),
    iconNumber: iconNumberSchema.optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.description !== undefined ||
      data.isGrid !== undefined ||
      data.iconNumber !== undefined,
    {
      message: "Informe ao menos um campo para atualizar",
    },
  );

export type UpdateListInput = z.infer<typeof updateListSchema>;
