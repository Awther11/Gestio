import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import { env } from "../../config/env";
import { AppError } from "../../errors/AppError";
import { createUser, publicUserSelect } from "../users/users.service";

export async function register(data: { nome: string; email: string; senha: string }) {
  return createUser(data);
}

export async function login(email: string, senha: string) {
  const user = await prisma.usuarios_api.findUnique({ where: { email } });

  // Mesma mensagem para email inexistente e senha errada (não revela quais emails existem)
  const invalid = new AppError("Email ou senha inválidos", 401);

  if (!user) throw invalid;

  const senhaOk = await bcrypt.compare(senha, user.senha_hash);
  if (!senhaOk) throw invalid;

  const token = jwt.sign({}, env.JWT_SECRET, {
    subject: user.id,
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  });

  const { senha_hash: _omit, ...safeUser } = user;
  return { token, user: safeUser };
}

export async function me(userId: string) {
  const user = await prisma.usuarios_api.findUnique({ where: { id: userId }, select: publicUserSelect });
  if (!user) throw new AppError("Usuário não encontrado", 404);
  return user;
}
