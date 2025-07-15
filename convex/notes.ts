import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { extractStreams } from "./utils";

export const sendMessage = mutation({
  args: {
    body: v.string(),
    selectedStream: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const streams = extractStreams(args.body);

    // Add selectedStream to the streams array if provided and not already included
    if (args.selectedStream && !streams.includes(args.selectedStream)) {
      streams.push(args.selectedStream);
    }

    await ctx.db.insert("messages", {
      user: "adam",
      body: args.body,
      timestamp: Date.now(),
      streams: streams,
    });
  },
});

export const getMessages = query({
  args: {
    stream: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db.query("messages").order("asc").collect();

    if (args.stream) {
      return messages.filter(
        (message) => message.streams && message.streams.includes(args.stream!),
      );
    }

    return messages;
  },
});

export const getAllStreams = query({
  args: {},
  handler: async (ctx) => {
    const messages = await ctx.db.query("messages").collect();
    const allStreams = new Set<string>();

    for (const message of messages) {
      if (message.streams) {
        for (const stream of message.streams) {
          allStreams.add(stream);
        }
      }
    }

    return Array.from(allStreams).sort();
  },
});

export const addStreamToMessage = mutation({
  args: {
    messageId: v.id("messages"),
    streamName: v.string(),
  },
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.messageId);
    if (!message) {
      throw new Error("Message not found");
    }

    const currentStreams = message.streams || [];

    // Add the stream if it's not already there
    if (!currentStreams.includes(args.streamName)) {
      const updatedStreams = [...currentStreams, args.streamName];
      await ctx.db.patch(args.messageId, { streams: updatedStreams });
    }
  },
});
