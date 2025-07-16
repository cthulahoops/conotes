import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  messages: defineTable({
    user: v.string(),
    body: v.string(),
    streams: v.optional(v.array(v.string())),
    attachments: v.optional(v.array(v.id("_storage"))),
  }),
});

export default schema;
