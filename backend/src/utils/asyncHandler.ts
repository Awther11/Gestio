import { NextFunction, Request, RequestHandler, Response } from "express";

// No Express 4, erros em funções async não chegam ao errorHandler sozinhos.
// Este wrapper captura a rejeição e chama next(err).
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    fn(req, res, next).catch(next);
  };
