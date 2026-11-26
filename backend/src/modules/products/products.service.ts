import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/AppError";
import { CreateProductInput, ListProductsQuery, UpdateProductInput } from "./products.schemas";

// IMPORTANTE: o banco ignora RLS para esta API (conexão como postgres),
// então TODA consulta precisa filtrar por usuario_id.

export function createProduct(usuarioId: string, data: CreateProductInput) {
  return prisma.produtos.create({ data: { ...data, usuario_id: usuarioId } });
}

export async function listProducts(usuarioId: string, { page, limit, busca, ativo }: ListProductsQuery) {
  const where: Prisma.produtosWhereInput = {
    usuario_id: usuarioId,
    ativo,
    ...(busca && { nome: { contains: busca, mode: "insensitive" } }),
  };

  const [data, total] = await prisma.$transaction([
    prisma.produtos.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { criado_em: "desc" },
    }),
    prisma.produtos.count({ where }),
  ]);

  return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

export async function getProductById(usuarioId: string, id: string) {
  // findFirst com usuario_id: produto de outro usuário aparece como 404 (não vaza que existe)
  const product = await prisma.produtos.findFirst({ where: { id, usuario_id: usuarioId } });
  if (!product) throw new AppError("Produto não encontrado", 404);
  return product;
}

export async function updateProduct(usuarioId: string, id: string, data: UpdateProductInput) {
  await getProductById(usuarioId, id);
  return prisma.produtos.update({ where: { id }, data });
}

// Soft delete: produtos com vendas/entradas não podem ser apagados de verdade
// (as tabelas itens_venda e entradas_estoque apontam para eles).
export async function deactivateProduct(usuarioId: string, id: string) {
  await getProductById(usuarioId, id);
  await prisma.produtos.update({ where: { id }, data: { ativo: false } });
}
