import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";

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

// Proxy action to call NVIDIA API (avoids CORS issues on client)
export const generateSD35Image = action({
    args: {
        prompt: v.string(),
        apiKey: v.string(),
        endpoint: v.string(),
        steps: v.number(),
        seed: v.number(),
        aspectRatio: v.string(),
    },
    handler: async (ctx, args) => {
        console.log(`Generating SD3.5 image. Endpoint: ${args.endpoint}`);
        const payload = {
            "prompt": args.prompt,
            "mode": "text-to-image",
            "seed": args.seed,
            "cfg_scale": 5,
            "steps": args.steps,
            "aspect_ratio": "1:1", // Default, could be passed from args if needed
            "output_format": "jpeg"
        };

        // Adjust payload for local NIM or OpenAI-compatible endpoints
        const isLocal = args.endpoint.includes('localhost') || args.endpoint.includes('/v1/infer');
        const apiBody = isLocal ? {
            model: "stable-diffusion-3-medium",
            prompt: args.prompt,
            mode: "base",
            seed: args.seed,
            steps: args.steps
        } : payload;

        const response = await fetch(args.endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${args.apiKey}`,
                "Accept": "application/json"
            },
            body: JSON.stringify(apiBody)
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`API Failed: ${response.status} ${err} (URL: ${args.endpoint})`);
        }

        const data = await response.json();
        console.log("Nvidia API Response (First 200 chars):", JSON.stringify(data).substring(0, 200));

        // Handle variations in response structure
        if (data.image) return data.image; // Direct image property
        if (data.images && data.images[0]) return data.images[0]; // Array of images
        if (data.artifacts && data.artifacts[0]) {
            return data.artifacts[0].base64;
        }
        else if (data.data && data.data[0]?.b64_json) {
            return data.data[0].b64_json;
        }

        throw new Error(`No image data in response. Keys found: ${Object.keys(data).join(', ')}`);
    },
});
