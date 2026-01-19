import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Save a new chat message
export const saveMessage = mutation({
    args: {
        userId: v.string(),
        role: v.string(),
        text: v.string(),
        timestamp: v.string(),
    },
    handler: async (ctx, args) => {
        const messageId = await ctx.db.insert("chatMessages", {
            userId: args.userId,
            role: args.role,
            text: args.text,
            timestamp: args.timestamp,
        });
        return messageId;
    },
});

// Get all chat messages for a specific user
export const getMessages = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        const messages = await ctx.db
            .query("chatMessages")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .order("asc") // Oldest first for chat order
            .collect();
        return messages;
    },
});

// Clear all chat messages for a user
export const clearMessages = mutation({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        const messages = await ctx.db
            .query("chatMessages")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .collect();

        for (const message of messages) {
            await ctx.db.delete(message._id);
        }
    },
});
