import { z } from "zod";

export const updateMeSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").optional(),
  birthDate: z.string().min(1, "Data de nascimento é obrigatória").optional(),
  phone: z.string().min(1, "Telefone é obrigatório").optional(),
  cpf: z.string().min(11, "CPF inválido").optional(),
  photo: z
    .string()
    .url("Foto deve ser uma URL válida")
    .optional()
    .or(z.literal("")),
  email: z.string().email("Email inválido").optional(),
});

export type UpdateMeInput = z.infer<typeof updateMeSchema>;
