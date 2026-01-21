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

    // User profile with streak data
    userProfiles: defineTable({
        clerkId: v.string(),
        currentStreak: v.number(),
        longestStreak: v.number(),
        lastLoginDate: v.string(), // ISO date string (YYYY-MM-DD)
        totalImages: v.number(),
        createdAt: v.string(),
    }).index("by_clerk_id", ["clerkId"]),

    // Login activity log
    userActivity: defineTable({
        clerkId: v.string(),
        loginDate: v.string(), // ISO date string (YYYY-MM-DD)
        timestamp: v.string(), // Full ISO timestamp
    }).index("by_clerk_id", ["clerkId"]),
});
