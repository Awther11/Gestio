import { z } from "zod";
import { senhaRule } from "../users/users.schemas";

export const registerSchema = z.object({
  body: z.object({
    nome: z.string().min(2).max(100),
    email: z.string().email().toLowerCase(),
    senha: senhaRule,
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email().toLowerCase(),
    senha: z.string().min(1, "Senha obrigatória"),
  }),
});
