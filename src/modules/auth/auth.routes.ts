import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { validate } from "../../middlewares/validate";
import { authenticate } from "../../middlewares/auth";
import * as controller from "./auth.controller";
import { loginSchema, registerSchema } from "./auth.schemas";

export const authRoutes = Router();

authRoutes.post("/register", validate(registerSchema), asyncHandler(controller.register));
authRoutes.post("/login", validate(loginSchema), asyncHandler(controller.login));
authRoutes.get("/me", authenticate, asyncHandler(controller.me));
