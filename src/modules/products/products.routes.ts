import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { validate } from "../../middlewares/validate";
import { authenticate } from "../../middlewares/auth";
import * as controller from "./products.controller";
import {
  createProductSchema,
  listProductsSchema,
  productIdSchema,
  updateProductSchema,
} from "./products.schemas";

export const productsRoutes = Router();

// Todas as rotas exigem login: cada usuário só vê os próprios produtos
productsRoutes.use(authenticate);

productsRoutes.get("/", validate(listProductsSchema), asyncHandler(controller.list));
productsRoutes.get("/:id", validate(productIdSchema), asyncHandler(controller.getById));
productsRoutes.post("/", validate(createProductSchema), asyncHandler(controller.create));
productsRoutes.patch("/:id", validate(updateProductSchema), asyncHandler(controller.update));
productsRoutes.delete("/:id", validate(productIdSchema), asyncHandler(controller.remove));
