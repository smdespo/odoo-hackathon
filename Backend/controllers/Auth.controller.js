import { getAuth } from "@clerk/express";
import User from "../models/User.model.js";

/**
 * POST /api/auth/sync
 * ────────────────────
 * Call this from your frontend immediately after Clerk sign-in or sign-up.
 * It creates the user in MongoDB if they don't exist yet,
 * or updates their info if they do.
 *
 * Frontend usage:
 *   const token = await getToken()
 *   await fetch("/api/auth/sync", {
 *     method: "POST",
 *     headers: { Authorization: `Bearer ${token}` }
 *   })
 */
export const syncUser = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    const claims = req.auth?.sessionClaims ?? {};

    // Upsert: create if not exists, update if exists
    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      {
        $setOnInsert: {
          clerkId: userId,
          email: claims.email ?? "",
        },
        $set: {
          firstName: claims.given_name ?? "",
          lastName: claims.family_name ?? "",
          // Only overwrite avatarUrl with Clerk's if user hasn't set a custom one
        },
      },
      {
        upsert: true,       // create if doesn't exist
        new: true,          // return the updated doc
        runValidators: true,
      }
    );

    const isNewUser = user.createdAt?.getTime() === user.updatedAt?.getTime();

    return res.status(isNewUser ? 201 : 200).json({
      success: true,
      message: isNewUser ? "User registered successfully" : "User synced",
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 * ─────────────────
 * Returns the currently authenticated user's MongoDB document.
 * requireAuth middleware already attaches req.dbUser.
 */
export const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.dbUser,
  });
};

/**
 * POST /api/auth/logout
 * ──────────────────────
 * Clerk handles session invalidation on the frontend.
 * This endpoint is a backend acknowledgement — useful for
 * logging, analytics, or clearing server-side session data.
 */
export const logout = async (req, res) => {
  // In a Clerk + SPA setup, the actual logout happens on the frontend:
  //   import { useClerk } from "@clerk/react"
  //   const { signOut } = useClerk()
  //   await signOut()
  //
  // This route just confirms the backend received the logout intent.
  return res.status(200).json({
    success: true,
    message: "Logged out — please clear your session on the frontend",
  });
};

/**
 * DELETE /api/auth/account
 * ─────────────────────────
 * Soft-deletes the user's account in MongoDB.
 * Their Clerk account still exists; use the Clerk dashboard
 * or the Clerk API to fully delete the Clerk user.
 */
export const deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.dbUser._id, {
      isDeleted: true,
      email: `deleted_${Date.now()}_${req.dbUser.email}`, // free up the email
    });

    return res.status(200).json({
      success: true,
      message: "Account deactivated successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/register (alias for sync — useful if calling from Postman/tests)
 * Identical to syncUser. Kept separately so your routes can be named intuitively.
 */
export const registerUser = syncUser;

/**
 * POST /api/auth/login (alias — Clerk handles actual auth, this just syncs)
 * Same as syncUser. Call it after Clerk issues a token.
 */
export const loginUser = syncUser;