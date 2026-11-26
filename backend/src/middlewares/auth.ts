import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "../errors/AppError";

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    throw new AppError("Token não informado", 401);
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    if (!payload.sub) throw new Error("sem sub");
    req.user = { id: payload.sub };
  } catch {
    throw new AppError("Token inválido ou expirado", 401);
  }

  next();
}

// Só permite acessar o próprio usuário (:id)
export function ensureSelf(req: Request, _res: Response, next: NextFunction) {
  if (!req.user || req.user.id !== req.params.id) {
    throw new AppError("Você não tem permissão para esta ação", 403);
  }
  next();
}
