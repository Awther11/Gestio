import { NextFunction, Request, Response } from "express";
import { ZodTypeAny } from "zod";

// O schema deve ter o formato z.object({ body?, query?, params? })
export const validate =
  (schema: ZodTypeAny) => (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) return next(result.error);

    const { body, query } = result.data;
    if (body) req.body = body;
    if (query) req.query = query;

    next();
  };
