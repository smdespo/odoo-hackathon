import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // clerkId is the primary link between Clerk and our DB
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // ── Basic Info ────────────────────────────────────────
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    firstName: {
      type: String,
      trim: true,
      default: "",
    },
    lastName: {
      type: String,
      trim: true,
      default: "",
    },
    phoneNumber: {
      type: String,
      trim: true,
      default: "",
    },

    // ── Location ──────────────────────────────────────────
    city: {
      type: String,
      trim: true,
      default: "",
    },
    country: {
      type: String,
      trim: true,
      default: "",
    },

    // ── Profile ───────────────────────────────────────────
    bio: {
      type: String,
      maxlength: 500,
      default: "",
    },

    // avatarUrl can be:
    //   - A local path: "/uploads/avatars/uuid.jpg"
    //   - Clerk's hosted image URL (synced from Clerk)
    avatarUrl: {
      type: String,
      default: "",
    },

    // ── Role ──────────────────────────────────────────────
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // ── Preferences ───────────────────────────────────────
    preferences: {
      language: { type: String, default: "en" },
      currency: { type: String, default: "USD" },
      notifications: { type: Boolean, default: true },
    },

    // ── Soft delete ───────────────────────────────────────
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// Virtual: full name
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`.trim();
});

// Don't return sensitive fields in JSON
userSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const User = mongoose.model("User", userSchema);
export default User;