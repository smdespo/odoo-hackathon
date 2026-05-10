import { Router } from "express";
import {
  getUserTrips,
  getCommunityTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  addStop,
  removeStop,
  addActivity,
  togglePackingItem,
} from "../controllers/trip.controller.js";
import { requireAuth, optionalAuth } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * Trip Routes
 * Base path: /api/trips
 *
 * GET    /api/trips                            → user's trips
 * POST   /api/trips                            → create trip (multipart, field: "cover")
 * GET    /api/trips/community                  → public community trips
 * GET    /api/trips/:id                        → single trip
 * PATCH  /api/trips/:id                        → update trip
 * DELETE /api/trips/:id                        → delete trip
 *
 * Stops:
 * POST   /api/trips/:id/stops                  → add stop
 * DELETE /api/trips/:id/stops/:stopId          → remove stop
 *
 * Activities:
 * POST   /api/trips/:id/stops/:stopId/activities → add activity
 *
 * Packing:
 * PATCH  /api/trips/:id/packing/:itemId        → toggle isPacked
 */

// Community (public — no auth required)
router.get("/community", optionalAuth, getCommunityTrips);

// User's own trips
router.get("/", requireAuth, getUserTrips);
router.post("/", requireAuth, createTrip);  // multipart/form-data

// Single trip
router.get("/:id", optionalAuth, getTripById);
router.patch("/:id", requireAuth, updateTrip);
router.delete("/:id", requireAuth, deleteTrip);

// Stops
router.post("/:id/stops", requireAuth, addStop);
router.delete("/:id/stops/:stopId", requireAuth, removeStop);

// Activities
router.post("/:id/stops/:stopId/activities", requireAuth, addActivity);

// Packing list
router.patch("/:id/packing/:itemId", requireAuth, togglePackingItem);

export default router;