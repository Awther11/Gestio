import { z } from "zod";

export const senhaRule = z.string().min(8, "A senha deve ter no mínimo 8 caracteres").max(72);

export const userIdSchema = z.object({
  params: z.object({ id: z.string().uuid("ID inválido") }),
});

export const updateUserSchema = z.object({
  params: z.object({ id: z.string().uuid("ID inválido") }),
  body: z
    .object({
      nome: z.string().min(2).max(100).optional(),
      email: z.string().email().toLowerCase().optional(),
      senha: senhaRule.optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "Envie ao menos um campo para atualizar",
    }),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>["body"];
