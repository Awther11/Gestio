import { z } from "zod";

const idParam = z.object({ id: z.string().uuid("ID inválido") });

const produtoBody = z.object({
  nome: z.string().min(2).max(120),
  preco_custo: z.coerce.number().min(0, "Preço de custo não pode ser negativo").multipleOf(0.01),
  preco_venda: z.coerce.number().positive("O preço de venda deve ser maior que zero").multipleOf(0.01),
  quantidade_estoque: z.coerce.number().min(0).default(0),
  estoque_minimo: z.coerce.number().min(0).default(0),
});

export const createProductSchema = z.object({ body: produtoBody });

export const updateProductSchema = z.object({
  params: idParam,
  body: produtoBody
    .partial()
    .extend({ ativo: z.boolean().optional() })
    .refine((d) => Object.keys(d).length > 0, { message: "Envie ao menos um campo para atualizar" }),
});

export const productIdSchema = z.object({ params: idParam });

export const listProductsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    busca: z.string().trim().min(1).optional(),
    // por padrão lista só os ativos; use ?ativo=false para ver os desativados
    ativo: z.enum(["true", "false"]).default("true").transform((v) => v === "true"),
  }),
});

export type CreateProductInput = z.infer<typeof createProductSchema>["body"];
export type UpdateProductInput = z.infer<typeof updateProductSchema>["body"];
export type ListProductsQuery = z.infer<typeof listProductsSchema>["query"];
