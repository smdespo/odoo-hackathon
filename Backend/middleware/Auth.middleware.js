import { getAuth } from "@clerk/express";
import User from "../models/User.model.js";

/**
 * requireAuth
 * ─────────────
 * 1. Reads the Bearer token Clerk issued on the frontend.
 * 2. Verifies it via Clerk SDK (getAuth).
 * 3. Looks up (or creates) the user in MongoDB.
 * 4. Attaches req.dbUser so every controller can use it directly.
 */
export const requireAuth = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized — please sign in",
      });
    }

    // Find user in MongoDB by clerkId
    let user = await User.findOne({ clerkId: userId });

    // First time this Clerk user hits a protected route → create their record
    if (!user) {
      const claims = req.auth?.sessionClaims ?? {};
      user = await User.create({
        clerkId: userId,
        email: claims.email ?? "",
        firstName: claims.given_name ?? "",
        lastName: claims.family_name ?? "",
        avatarUrl: claims.image_url ?? "",
      });
    }

    // Soft-delete guard
    if (user.isDeleted) {
      return res.status(403).json({
        success: false,
        message: "This account has been deactivated",
      });
    }

    req.dbUser = user;
    req.clerkUserId = userId;
    next();
  } catch (error) {
    console.error("requireAuth error:", error.message);
    next(error);
  }
};

/**
 * requireAdmin
 * Must be used AFTER requireAuth.
 */
export const requireAdmin = (req, res, next) => {
  if (req.dbUser?.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Forbidden — admin access only",
    });
  }
  next();
};

/**
 * optionalAuth
 * Attaches req.dbUser if the request is authenticated,
 * but does NOT block unauthenticated requests.
 * Use on public routes that behave differently when logged in.
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return next();

    const user = await User.findOne({ clerkId: userId });
    req.dbUser = user ?? null;
    req.clerkUserId = userId;
    next();
  } catch {
    next(); // silently continue on failure
  }
};  