import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Save a new generated image
export const saveImage = mutation({
    args: {
        userId: v.string(),
        url: v.string(),
        prompt: v.string(),
        aspectRatio: v.string(),
        timestamp: v.string(),
    },
    handler: async (ctx, args) => {
        const imageId = await ctx.db.insert("images", {
            userId: args.userId,
            url: args.url,
            prompt: args.prompt,
            aspectRatio: args.aspectRatio,
            timestamp: args.timestamp,
        });
        return imageId;
    },
});

// Get all images for a specific user
export const getImages = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        const images = await ctx.db
            .query("images")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .order("desc")
            .collect();
        return images;
    },
});

// Delete an image by ID
export const deleteImage = mutation({
    args: { imageId: v.id("images") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.imageId);
    },
});
