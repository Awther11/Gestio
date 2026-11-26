import { Request, Response } from "express";
import * as usersService from "./users.service";

export async function getById(req: Request, res: Response) {
  const user = await usersService.getUserById(req.params.id);
  res.json(user);
}

export async function update(req: Request, res: Response) {
  const user = await usersService.updateUser(req.params.id, req.body);
  res.json(user);
}

export async function remove(req: Request, res: Response) {
  await usersService.deleteUser(req.params.id);
  res.status(204).send();
}
