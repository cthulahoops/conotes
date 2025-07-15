import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

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

function extractStreams(messageBody: string): string[] {
  const lines = messageBody.split("\n");
  const streams = new Set<string>();

  for (const line of lines) {
    let processLine = line;

    // Remove leading markdown header markers from the start of the line
    processLine = processLine.replace(/^\s*#+\s*/, "");

    const hashtags = processLine.match(/#([a-zA-Z0-9_-]+)/g);
    if (hashtags) {
      for (const hashtag of hashtags) {
        const streamName = hashtag.replace("#", "").toLowerCase();
        streams.add(streamName);
      }
    }
  }

  return Array.from(streams);
}
