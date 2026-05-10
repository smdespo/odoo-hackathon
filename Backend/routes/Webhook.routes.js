/**
 * Clerk Webhook Handler
 * ──────────────────────
 * Keeps MongoDB in sync when users are updated/deleted via Clerk dashboard.
 *
 * Setup:
 * 1. npm install svix
 * 2. Go to Clerk Dashboard → Webhooks → Add endpoint
 * 3. URL: https://your-domain.com/api/webhooks/clerk
 * 4. Subscribe to: user.created  user.updated  user.deleted
 * 5. Copy "Signing Secret" → CLERK_WEBHOOK_SECRET in .env
 */

import { Router } from "express";
import express from "express";
import { Webhook } from "svix";
import User from "../models/User.model.js";

const router = Router();

router.post(
  "/clerk",
  express.raw({ type: "application/json" }), // raw body needed for signature verification
  async (req, res) => {
    const secret = process.env.CLERK_WEBHOOK_SECRET;
    if (!secret) {
      console.error("CLERK_WEBHOOK_SECRET not set");
      return res.status(500).json({ error: "Webhook secret not configured" });
    }

    // Verify signature
    const wh = new Webhook(secret);
    let evt;
    try {
      evt = wh.verify(req.body, {
        "svix-id": req.headers["svix-id"],
        "svix-timestamp": req.headers["svix-timestamp"],
        "svix-signature": req.headers["svix-signature"],
      });
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).json({ error: "Invalid webhook signature" });
    }

    const { type, data } = evt;
    console.log(`Clerk webhook received: ${type}`);

    try {
      // ── User created ──────────────────────────────────────────────────────
      if (type === "user.created") {
        await User.findOneAndUpdate(
          { clerkId: data.id },
          {
            $setOnInsert: {
              clerkId: data.id,
              email: data.email_addresses?.[0]?.email_address ?? "",
              firstName: data.first_name ?? "",
              lastName: data.last_name ?? "",
              avatarUrl: data.image_url ?? "",
            },
          },
          { upsert: true, new: true }
        );
      }

      // ── User updated ──────────────────────────────────────────────────────
      if (type === "user.updated") {
        await User.findOneAndUpdate(
          { clerkId: data.id },
          {
            $set: {
              email: data.email_addresses?.[0]?.email_address ?? "",
              firstName: data.first_name ?? "",
              lastName: data.last_name ?? "",
              // Only update avatarUrl from Clerk if user hasn't uploaded a custom one
            },
          }
        );
      }

      // ── User deleted ──────────────────────────────────────────────────────
      if (type === "user.deleted") {
        await User.findOneAndUpdate(
          { clerkId: data.id },
          { $set: { isDeleted: true } }
        );
      }

      return res.status(200).json({ received: true });
    } catch (err) {
      console.error("Webhook DB error:", err.message);
      return res.status(500).json({ error: "Database error" });
    }
  }
);

export default router;