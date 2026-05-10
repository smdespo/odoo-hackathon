export const errorHandler = (err, _req, res, _next) => {
  console.error("❌ Error:", err.message);

  // Multer: file too large
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      success: false,
      message: `File too large. Max size is ${process.env.MAX_FILE_SIZE_MB || 5}MB`,
    });
  }

  // Multer: wrong file type (thrown manually in imageFilter)
  if (err.message?.includes("Only JPEG")) {
    return res.status(415).json({ success: false, message: err.message });
  }

  // Mongoose: duplicate key (unique field already exists)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] ?? "field";
    return res.status(409).json({
      success: false,
      message: `${field} already exists`,
    });
  }

  // Mongoose: validation errors
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: messages.join(", ") });
  }

  // Mongoose: bad ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({ success: false, message: "Invalid ID format" });
  }

  // Default
  res.status(err.status || err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
};