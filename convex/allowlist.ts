import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

export const isEmailAllowed = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const allowedUser = await ctx.db
      .query("allowlist")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    return allowedUser !== null;
  },
});

export const addToAllowlist = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    // Check if email is already in allowlist
    const existing = await ctx.db
      .query("allowlist")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (existing) {
      throw new Error("Email is already in allowlist");
    }

    await ctx.db.insert("allowlist", {
      email: args.email,
      addedBy: userId || undefined,
      addedAt: Date.now(),
    });

    return { success: true };
  },
});

export const removeFromAllowlist = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Must be authenticated to manage allowlist");
    }

    const allowlistEntry = await ctx.db
      .query("allowlist")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (!allowlistEntry) {
      throw new Error("Email not found in allowlist");
    }

    await ctx.db.delete(allowlistEntry._id);

    return { success: true };
  },
});

export const getAllowlist = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return [];
    }

    const allowlist = await ctx.db.query("allowlist").order("desc").collect();

    return allowlist;
  },
});

// Admin function to bootstrap the first user (use this in Convex dashboard)
export const bootstrapFirstUser = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    // Check if allowlist is empty (no users yet)
    const existingEntries = await ctx.db.query("allowlist").collect();

    if (existingEntries.length > 0) {
      throw new Error(
        "Allowlist already has entries. Use addToAllowlist instead.",
      );
    }

    await ctx.db.insert("allowlist", {
      email: args.email,
      addedBy: undefined, // No user added this, it's a bootstrap
      addedAt: Date.now(),
    });

    return {
      success: true,
      message: `Bootstrap: Added ${args.email} to allowlist`,
    };
  },
});

// Admin function to check allowlist status
export const getAllowlistStatus = query({
  args: {},
  handler: async (ctx) => {
    const totalEntries = await ctx.db.query("allowlist").collect();
    const totalUsers = await ctx.db.query("users").collect();

    return {
      allowlistEntries: totalEntries.length,
      totalUsers: totalUsers.length,
      emails: totalEntries.map((entry) => entry.email),
    };
  },
});

