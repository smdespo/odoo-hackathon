import { Router } from "express";
import {
  syncUser,
  getMe,
  logout,
  deleteAccount,
  registerUser,
  loginUser,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * Auth Routes
 * Base path: /api/auth
 *
 * POST   /api/auth/register  → sync after Clerk sign-up
 * POST   /api/auth/login     → sync after Clerk sign-in
 * POST   /api/auth/sync      → generic sync (same as above)
 * GET    /api/auth/me        → get current user
 * POST   /api/auth/logout    → backend logout acknowledgement
 * DELETE /api/auth/account   → soft-delete account
 */

// Called from frontend right after Clerk sign-up
router.post("/register", requireAuth, registerUser);

// Called from frontend right after Clerk sign-in
router.post("/login", requireAuth, loginUser);

// Generic sync — same behaviour, different name for flexibility
router.post("/sync", requireAuth, syncUser);

// Get current authenticated user
router.get("/me", requireAuth, getMe);

// Backend logout acknowledgement
router.post("/logout", requireAuth, logout);

// Soft-delete user account
router.delete("/account", requireAuth, deleteAccount);

export default router;