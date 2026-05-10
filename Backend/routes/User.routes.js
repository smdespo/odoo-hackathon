import { Router } from "express";
import {
  getProfile,
  updateProfile,
  uploadUserAvatar,
  deleteUserAvatar,
  getPublicProfile,
  getAllUsers,
} from "../controllers/user.controller.js";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * User Routes
 * Base path: /api/users
 *
 * GET    /api/users/profile      → own profile (auth required)
 * PATCH  /api/users/profile      → update profile fields
 * POST   /api/users/avatar       → upload profile image (multipart, field: "avatar")
 * DELETE /api/users/avatar       → remove profile image
 * GET    /api/users/:id          → public profile of any user
 * GET    /api/users              → all users (admin only)
 */

// Own profile
router.get("/profile", requireAuth, getProfile);
router.patch("/profile", requireAuth, updateProfile);

// Avatar
router.post("/avatar", requireAuth, uploadUserAvatar);
router.delete("/avatar", requireAuth, deleteUserAvatar);

// Admin
router.get("/", requireAuth, requireAdmin, getAllUsers);

// Public profile (must be last to avoid catching "profile", "avatar" etc.)
router.get("/:id", getPublicProfile);

export default router;