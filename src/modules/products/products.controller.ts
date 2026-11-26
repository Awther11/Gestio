import { Request, Response } from "express";
import * as productsService from "./products.service";
import { ListProductsQuery } from "./products.schemas";

export async function create(req: Request, res: Response) {
  const product = await productsService.createProduct(req.user!.id, req.body);
  res.status(201).json(product);
}

export async function list(req: Request, res: Response) {
  const result = await productsService.listProducts(req.user!.id, req.query as unknown as ListProductsQuery);
  res.json(result);
}

export async function getById(req: Request, res: Response) {
  const product = await productsService.getProductById(req.user!.id, req.params.id);
  res.json(product);
}

export async function update(req: Request, res: Response) {
  const product = await productsService.updateProduct(req.user!.id, req.params.id, req.body);
  res.json(product);
}

export async function remove(req: Request, res: Response) {
  await productsService.deactivateProduct(req.user!.id, req.params.id);
  res.status(204).send();
}
