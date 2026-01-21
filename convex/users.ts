import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Helper to get today's date in YYYY-MM-DD format
function getToday(): string {
    return new Date().toISOString().split("T")[0];
}

// Helper to get yesterday's date in YYYY-MM-DD format
function getYesterday(): string {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split("T")[0];
}

// Record a user login and update streak
export const recordLogin = mutation({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        const today = getToday();
        const yesterday = getYesterday();

        // Check if user profile exists
        const existingProfile = await ctx.db
            .query("userProfiles")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first();

        if (!existingProfile) {
            // First time user - create profile with streak = 1
            await ctx.db.insert("userProfiles", {
                clerkId: args.clerkId,
                currentStreak: 1,
                longestStreak: 1,
                lastLoginDate: today,
                totalImages: 0,
                createdAt: new Date().toISOString(),
            });
        } else {
            // User exists - check streak logic
            const lastLogin = existingProfile.lastLoginDate;

            if (lastLogin === today) {
                // Already logged in today - do nothing
                return { streak: existingProfile.currentStreak, isNewDay: false };
            }

            let newStreak: number;
            if (lastLogin === yesterday) {
                // Consecutive day - increment streak
                newStreak = existingProfile.currentStreak + 1;
            } else {
                // Missed a day - reset streak
                newStreak = 1;
            }

            const newLongest = Math.max(newStreak, existingProfile.longestStreak);

            await ctx.db.patch(existingProfile._id, {
                currentStreak: newStreak,
                longestStreak: newLongest,
                lastLoginDate: today,
            });
        }

        // Log the activity
        await ctx.db.insert("userActivity", {
            clerkId: args.clerkId,
            loginDate: today,
            timestamp: new Date().toISOString(),
        });

        // Get updated profile
        const updatedProfile = await ctx.db
            .query("userProfiles")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first();

        return {
            streak: updatedProfile?.currentStreak ?? 1,
            isNewDay: true,
        };
    },
});

// Get user profile with streak data
export const getUserProfile = query({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        const profile = await ctx.db
            .query("userProfiles")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first();

        if (!profile) {
            return null;
        }

        return {
            currentStreak: profile.currentStreak,
            longestStreak: profile.longestStreak,
            lastLoginDate: profile.lastLoginDate,
            totalImages: profile.totalImages,
        };
    },
});

// Increment total images count for a user
export const incrementImageCount = mutation({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        const profile = await ctx.db
            .query("userProfiles")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first();

        if (profile) {
            await ctx.db.patch(profile._id, {
                totalImages: profile.totalImages + 1,
            });
        }
    },
});
