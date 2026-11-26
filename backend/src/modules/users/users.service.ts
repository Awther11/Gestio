import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/AppError";
import { UpdateUserInput } from "./users.schemas";

// Nunca selecionamos senha_hash nas respostas
export const publicUserSelect = {
  id: true,
  nome: true,
  email: true,
  criado_em: true,
  atualizado_em: true,
} satisfies Prisma.usuarios_apiSelect;

export async function createUser(data: { nome: string; email: string; senha: string }) {
  const exists = await prisma.usuarios_api.findUnique({ where: { email: data.email } });
  if (exists) throw new AppError("Email já cadastrado", 409);

  const senha_hash = await bcrypt.hash(data.senha, 10);

  return prisma.usuarios_api.create({
    data: { nome: data.nome, email: data.email, senha_hash },
    select: publicUserSelect,
  });
}

export async function getUserById(id: string) {
  const user = await prisma.usuarios_api.findUnique({ where: { id }, select: publicUserSelect });
  if (!user) throw new AppError("Usuário não encontrado", 404);
  return user;
}

export async function updateUser(id: string, data: UpdateUserInput) {
  await getUserById(id); // garante 404 se não existir

  const { senha, ...rest } = data;

  return prisma.usuarios_api.update({
    where: { id },
    data: {
      ...rest,
      ...(senha && { senha_hash: await bcrypt.hash(senha, 10) }),
    },
    select: publicUserSelect,
  });
}

// Atenção: os dados do usuário (produtos, vendas...) NÃO são apagados junto.
export async function deleteUser(id: string) {
  await getUserById(id);
  await prisma.usuarios_api.delete({ where: { id } });
}
