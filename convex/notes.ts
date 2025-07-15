import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { extractStreams } from "./utils";

export const sendMessage = mutation({
  args: {
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const streams = extractStreams(args.body);
    await ctx.db.insert("messages", {
      user: "adam",
      body: args.body,
      timestamp: Date.now(),
      streams: streams,
    });
  },
});

export const getMessages = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("messages").order("asc").collect();
  },
});
