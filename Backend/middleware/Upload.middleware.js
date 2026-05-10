import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";

// Ensure directories exist on startup
["avatars", "covers"].forEach((dir) => {
  fs.mkdirSync(path.join(UPLOAD_DIR, dir), { recursive: true });
});

// ── Storage factory ───────────────────────────────────────────────────────────
const makeStorage = (subdir) =>
  multer.diskStorage({
    destination: (_req, _file, cb) =>
      cb(null, path.join(UPLOAD_DIR, subdir)),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${uuidv4()}${ext}`); // e.g. 3f2504e0-4f89.jpg
    },
  });

// ── Image-only filter ─────────────────────────────────────────────────────────
const imageFilter = (_req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, WebP, or GIF images are allowed"), false);
  }
};

const MAX_SIZE = (parseInt(process.env.MAX_FILE_SIZE_MB) || 5) * 1024 * 1024;

// ── Exported uploaders ────────────────────────────────────────────────────────

/** Avatar upload — field name must be "avatar" in FormData */
export const uploadAvatar = multer({
  storage: makeStorage("avatars"),
  fileFilter: imageFilter,
  limits: { fileSize: MAX_SIZE },
}).single("avatar");

/** Trip cover upload — field name must be "cover" in FormData */
export const uploadCover = multer({
  storage: makeStorage("covers"),
  fileFilter: imageFilter,
  limits: { fileSize: MAX_SIZE },
}).single("cover");

/**
 * buildFileUrl
 * Converts a local file path to a full public URL.
 * e.g. "uploads/avatars/uuid.jpg" → "http://localhost:5000/uploads/avatars/uuid.jpg"
 */
export const buildFileUrl = (req, filePath) =>
  `${req.protocol}://${req.get("host")}/${filePath.replace(/\\/g, "/")}`;

/**
 * deleteLocalFile
 * Safely removes a locally stored file (won't throw if missing).
 */
export const deleteLocalFile = (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (err) {
    console.warn("Could not delete file:", err.message);
  }
};