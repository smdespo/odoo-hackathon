import mongoose from "mongoose";

// ── Activity sub-schema ───────────────────────────────────────────────────────
const activitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, trim: true, default: "general" },
    startDate: { type: Date },
    endDate: { type: Date },
    cost: { type: Number, default: 0, min: 0 },
    notes: { type: String, default: "" },
  },
  { _id: true }
);

// ── Stop sub-schema ───────────────────────────────────────────────────────────
const stopSchema = new mongoose.Schema(
  {
    city: { type: String, required: true, trim: true },
    country: { type: String, trim: true, default: "" },
    startDate: { type: Date },
    endDate: { type: Date },
    sortOrder: { type: Number, default: 0 },
    notes: { type: String, default: "" },
    activities: [activitySchema],
  },
  { _id: true }
);

// ── Packing item sub-schema ───────────────────────────────────────────────────
const packingItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["clothing", "documents", "electronics", "toiletries", "general"],
      default: "general",
    },
    isPacked: { type: Boolean, default: false },
  },
  { _id: true }
);

// ── Note sub-schema ───────────────────────────────────────────────────────────
const noteSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    stopId: { type: mongoose.Schema.Types.ObjectId, default: null },
  },
  { timestamps: true }
);

// ── Trip schema ───────────────────────────────────────────────────────────────
const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    coverImage: { type: String, default: "" },

    startDate: { type: Date },
    endDate: { type: Date },

    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed"],
      default: "upcoming",
    },

    isPublic: { type: Boolean, default: false },
    totalBudget: { type: Number, default: 0, min: 0 },

    stops: [stopSchema],
    packingList: [packingItemSchema],
    notes: [noteSchema],
  },
  {
    timestamps: true,
  }
);

// Auto-compute status based on dates before save
tripSchema.pre("save", function (next) {
  const now = new Date();
  if (this.startDate && this.endDate) {
    if (now < this.startDate) this.status = "upcoming";
    else if (now >= this.startDate && now <= this.endDate) this.status = "ongoing";
    else this.status = "completed";
  }
  next();
});

tripSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => { delete ret.__v; return ret; },
});

const Trip = mongoose.model("Trip", tripSchema);
export default Trip;