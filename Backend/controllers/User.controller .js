import User from "../models/User.model.js";
import {
  uploadAvatar,
  buildFileUrl,
  deleteLocalFile,
} from "../middleware/upload.middleware.js";

/**
 * GET /api/users/profile
 * Returns the authenticated user's full profile.
 */
export const getProfile = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.dbUser,
  });
};

/**
 * PATCH /api/users/profile
 * Updates editable profile fields.
 * Does NOT handle avatar — use the dedicated avatar endpoint.
 *
 * Body (all optional):
 *   { firstName, lastName, phoneNumber, city, country, bio, preferences }
 */
export const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      "firstName",
      "lastName",
      "phoneNumber",
      "city",
      "country",
      "bio",
      "preferences",
    ];

    // Only pick fields that are actually sent in the request
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided to update",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.dbUser._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/users/avatar
 * ──────────────────────
 * Accepts: multipart/form-data  →  field name: "avatar"
 * Saves the image to uploads/avatars/, updates MongoDB,
 * and deletes the previous local avatar if one existed.
 *
 * Frontend usage:
 *   const formData = new FormData()
 *   formData.append("avatar", fileInputRef.current.files[0])
 *   fetch("/api/users/avatar", {
 *     method: "POST",
 *     headers: { Authorization: `Bearer ${token}` },
 *     body: formData   // ← no Content-Type header, browser sets it
 *   })
 */
export const uploadUserAvatar = (req, res, next) => {
  uploadAvatar(req, res, async (err) => {
    if (err) return next(err);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Use field name "avatar".',
      });
    }

    try {
      const newAvatarUrl = buildFileUrl(req, req.file.path);

      // Delete old avatar if it was locally stored (not a Clerk/external URL)
      const oldUrl = req.dbUser.avatarUrl;
      if (oldUrl && oldUrl.includes("/uploads/avatars/")) {
        const localPath = oldUrl.split(`${req.get("host")}/`)[1];
        if (localPath) deleteLocalFile(localPath);
      }

      const user = await User.findByIdAndUpdate(
        req.dbUser._id,
        { $set: { avatarUrl: newAvatarUrl } },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message: "Avatar uploaded successfully",
        avatarUrl: newAvatarUrl,
        user,
      });
    } catch (error) {
      // If DB update fails, clean up the just-uploaded file
      deleteLocalFile(req.file.path);
      next(error);
    }
  });
};

/**
 * DELETE /api/users/avatar
 * Removes the avatar from disk and clears it in MongoDB.
 */
export const deleteUserAvatar = async (req, res, next) => {
  try {
    const oldUrl = req.dbUser.avatarUrl;

    if (!oldUrl) {
      return res.status(400).json({
        success: false,
        message: "No avatar to delete",
      });
    }

    // Only delete locally stored files
    if (oldUrl.includes("/uploads/avatars/")) {
      const localPath = oldUrl.split(`${req.get("host")}/`)[1];
      if (localPath) deleteLocalFile(localPath);
    }

    const user = await User.findByIdAndUpdate(
      req.dbUser._id,
      { $set: { avatarUrl: "" } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Avatar removed",
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users/:id  (public profile — for community page)
 * Returns limited public fields of any user.
 */
export const getPublicProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(
      "firstName lastName avatarUrl city country bio createdAt"
    );

    if (!user || user.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users  (admin only — list all users)
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search = "" } = req.query;
    const skip = (page - 1) * limit;

    const query = { isDeleted: false };
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(query).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
      User.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      users,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};