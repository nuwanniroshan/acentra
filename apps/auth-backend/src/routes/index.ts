import { Router } from "express";
import { AuthController } from "@/controller/AuthController";
import { UserController } from "@/controller/UserController";
import { authMiddleware, requireRole } from "@acentra/auth-utils";
import { UserRole } from "@acentra/shared-types";

const router = Router();

// Get JWT secret from environment
const auth = authMiddleware(process.env.JWT_SECRET || "secret");

// Public routes
router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);
router.post("/auth/logout", AuthController.logout);
router.get("/auth/tenant/:slug", AuthController.validateTenant);

// Protected routes - require authentication
router.post("/auth/verify", auth, AuthController.verify);
router.post("/auth/refresh", auth, AuthController.refresh);
router.get("/auth/me", auth, AuthController.me);

// User management routes - require admin role
router.get("/users", auth, requireRole(UserRole.ADMIN), UserController.list);
router.delete("/users/:id", auth, requireRole(UserRole.ADMIN), UserController.delete);
router.patch("/users/:id/role", auth, requireRole(UserRole.ADMIN), UserController.updateRole);
router.patch("/users/:id/toggle-active", auth, requireRole(UserRole.ADMIN), UserController.toggleActive);

export default router;
