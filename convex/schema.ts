import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  messages: defineTable({
    userId: v.optional(v.id("users")),
    body: v.string(),
    streams: v.array(v.string()),
    attachments: v.array(v.id("_storage")),
  }),
  allowlist: defineTable({
    email: v.string(),
    addedBy: v.optional(v.id("users")),
    addedAt: v.number(),
  }).index("by_email", ["email"]),
});

export default schema;
