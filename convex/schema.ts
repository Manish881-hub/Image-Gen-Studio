import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    images: defineTable({
        userId: v.string(),
        url: v.string(),
        prompt: v.string(),
        aspectRatio: v.string(),
        timestamp: v.string(),
    }).index("by_user", ["userId"]),

    chatMessages: defineTable({
        userId: v.string(),
        role: v.string(), // 'user', 'bot', or 'error'
        text: v.string(),
        timestamp: v.string(),
    }).index("by_user", ["userId"]),
});
