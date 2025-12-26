import { Router } from "express";
import { AuthController } from "@/controller/AuthController";
import { UserController } from "@/controller/UserController";
import { ResetPasswordController } from "@/controller/ResetPasswordController";
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
router.post("/auth/forgot-password", ResetPasswordController.forgotPassword);
router.post("/auth/reset-password", ResetPasswordController.resetPassword);

// Protected routes - require authentication
router.post("/auth/verify", auth, AuthController.verify);
router.post("/auth/refresh", auth, AuthController.refresh);
router.get("/auth/me", auth, AuthController.me);
router.post("/auth/change-password", auth, AuthController.changePassword);

// User management routes - require admin role
router.get("/users", auth, requireRole(UserRole.ADMIN), UserController.list);
router.delete("/users/:id", auth, requireRole(UserRole.ADMIN), UserController.delete);
router.patch("/users/:id/role", auth, requireRole(UserRole.ADMIN), UserController.updateRole);
router.patch("/users/:id/toggle-active", auth, requireRole(UserRole.ADMIN), UserController.toggleActive);
router.post("/users/:id/reset-password", auth, requireRole(UserRole.ADMIN), AuthController.adminResetPassword);

export default router;
