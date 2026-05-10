import Trip from "../models/Trip.model.js";
import {
  uploadCover,
  buildFileUrl,
  deleteLocalFile,
} from "../middleware/upload.middleware.js";

/**
 * GET /api/trips
 * Returns all trips for the authenticated user.
 * Query params: ?status=upcoming|ongoing|completed
 */
export const getUserTrips = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = { userId: req.dbUser._id };
    if (status) query.status = status;

    const trips = await Trip.find(query).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, count: trips.length, trips });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/trips/community
 * Returns all public trips for the community tab.
 * Populates basic user info (name + avatar).
 */
export const getCommunityTrips = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const trips = await Trip.find({ isPublic: true })
      .populate("userId", "firstName lastName avatarUrl city country")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Trip.countDocuments({ isPublic: true });

    return res.status(200).json({
      success: true,
      trips,
      pagination: { total, page: Number(page), limit: Number(limit) },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/trips/:id
 * Returns a single trip. Public trips are visible to anyone;
 * private trips only to the owner.
 */
export const getTripById = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id).populate(
      "userId",
      "firstName lastName avatarUrl"
    );

    if (!trip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }

    const isOwner = trip.userId._id.toString() === req.dbUser?._id.toString();
    if (!trip.isPublic && !isOwner) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    return res.status(200).json({ success: true, trip });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/trips
 * Creates a new trip. Accepts multipart/form-data for optional cover image.
 * Field name for cover: "cover"
 */
export const createTrip = (req, res, next) => {
  uploadCover(req, res, async (err) => {
    if (err) return next(err);

    try {
      const {
        title, description, startDate, endDate, isPublic, totalBudget,
      } = req.body;

      if (!title) {
        return res.status(400).json({ success: false, message: "Title is required" });
      }

      const coverImage = req.file ? buildFileUrl(req, req.file.path) : "";

      const trip = await Trip.create({
        userId: req.dbUser._id,
        title,
        description,
        coverImage,
        startDate: startDate || null,
        endDate: endDate || null,
        isPublic: isPublic === "true" || isPublic === true,
        totalBudget: totalBudget || 0,
      });

      return res.status(201).json({
        success: true,
        message: "Trip created",
        trip,
      });
    } catch (error) {
      if (req.file) deleteLocalFile(req.file.path);
      next(error);
    }
  });
};

/**
 * PATCH /api/trips/:id
 * Updates trip fields. Owner only.
 */
export const updateTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.dbUser._id,
    });

    if (!trip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }

    const allowedFields = [
      "title", "description", "startDate", "endDate",
      "status", "isPublic", "totalBudget",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) trip[field] = req.body[field];
    });

    await trip.save();

    return res.status(200).json({ success: true, message: "Trip updated", trip });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/trips/:id
 * Permanently deletes a trip. Owner only.
 */
export const deleteTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOneAndDelete({
      _id: req.params.id,
      userId: req.dbUser._id,
    });

    if (!trip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }

    // Clean up cover image if locally stored
    if (trip.coverImage?.includes("/uploads/covers/")) {
      const localPath = trip.coverImage.split(`${req.get("host")}/`)[1];
      if (localPath) deleteLocalFile(localPath);
    }

    return res.status(200).json({ success: true, message: "Trip deleted" });
  } catch (error) {
    next(error);
  }
};

// ── Stops ─────────────────────────────────────────────────────────────────────

/** POST /api/trips/:id/stops — add a stop to a trip */
export const addStop = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.dbUser._id });
    if (!trip) return res.status(404).json({ success: false, message: "Trip not found" });

    const { city, country, startDate, endDate, notes, sortOrder } = req.body;
    if (!city) return res.status(400).json({ success: false, message: "City is required" });

    trip.stops.push({ city, country, startDate, endDate, notes, sortOrder });
    await trip.save();

    return res.status(201).json({ success: true, message: "Stop added", trip });
  } catch (error) { next(error); }
};

/** DELETE /api/trips/:id/stops/:stopId — remove a stop */
export const removeStop = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.dbUser._id });
    if (!trip) return res.status(404).json({ success: false, message: "Trip not found" });

    trip.stops = trip.stops.filter(
      (s) => s._id.toString() !== req.params.stopId
    );
    await trip.save();

    return res.status(200).json({ success: true, message: "Stop removed", trip });
  } catch (error) { next(error); }
};

// ── Activities ────────────────────────────────────────────────────────────────

/** POST /api/trips/:id/stops/:stopId/activities — add activity to a stop */
export const addActivity = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.dbUser._id });
    if (!trip) return res.status(404).json({ success: false, message: "Trip not found" });

    const stop = trip.stops.id(req.params.stopId);
    if (!stop) return res.status(404).json({ success: false, message: "Stop not found" });

    const { name, category, startDate, endDate, cost, notes } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Activity name is required" });

    stop.activities.push({ name, category, startDate, endDate, cost, notes });
    await trip.save();

    return res.status(201).json({ success: true, message: "Activity added", trip });
  } catch (error) { next(error); }
};

// ── Packing list ──────────────────────────────────────────────────────────────

/** PATCH /api/trips/:id/packing/:itemId — toggle isPacked */
export const togglePackingItem = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.dbUser._id });
    if (!trip) return res.status(404).json({ success: false, message: "Trip not found" });

    const item = trip.packingList.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    item.isPacked = !item.isPacked;
    await trip.save();

    return res.status(200).json({ success: true, trip });
  } catch (error) { next(error); }
};