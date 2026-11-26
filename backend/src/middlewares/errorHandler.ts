import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { AppError } from "../errors/AppError";
import { env } from "../config/env";

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ message: "Rota não encontrada" });
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Dados inválidos",
      errors: err.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({ message: "Já existe um registro com esse valor único (ex.: email)" });
    }
    if (err.code === "P2003") {
      return res.status(409).json({ message: "Registro está em uso por outros dados e não pode ser removido" });
    }
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Registro não encontrado" });
    }
  }

  // JSON malformado no body
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ message: "JSON inválido" });
  }

  console.error(err);
  res.status(500).json({
    message: "Erro interno do servidor",
    ...(env.NODE_ENV === "development" && { detail: String(err) }),
  });
}
