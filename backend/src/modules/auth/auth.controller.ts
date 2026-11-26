import { Request, Response } from "express";
import * as authService from "./auth.service";

export async function register(req: Request, res: Response) {
  const user = await authService.register(req.body);
  res.status(201).json(user);
}

export async function login(req: Request, res: Response) {
  const { email, senha } = req.body;
  const result = await authService.login(email, senha);
  res.json(result);
}

export async function me(req: Request, res: Response) {
  const user = await authService.me(req.user!.id);
  res.json(user);
}
