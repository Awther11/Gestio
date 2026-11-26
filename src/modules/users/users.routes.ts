import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { validate } from "../../middlewares/validate";
import { authenticate, ensureSelf } from "../../middlewares/auth";
import * as controller from "./users.controller";
import { updateUserSchema, userIdSchema } from "./users.schemas";

export const usersRoutes = Router();

usersRoutes.use(authenticate);

usersRoutes.get("/:id", validate(userIdSchema), ensureSelf, asyncHandler(controller.getById));
usersRoutes.patch("/:id", validate(updateUserSchema), ensureSelf, asyncHandler(controller.update));
usersRoutes.delete("/:id", validate(userIdSchema), ensureSelf, asyncHandler(controller.remove));
