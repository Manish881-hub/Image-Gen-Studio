export const popularPrompts = [
    "A futuristic city with flying cars at sunset, cyberpunk style",
    "A serene Japanese garden with cherry blossoms falling, 8k resolution",
    "Portrait of a robot mechanic fixing a vintage car, detailed digital art",
    "A magical forest with glowing mushrooms and fairy lights, fantasy concept art",
    "An astronaut floating in a nebula, cinematic lighting, photorealistic",
    "Isometric view of a cozy coffee shop interior, low poly style",
    "A steampunk airship navigating through stormy clouds, oil painting style",
    "Minimalist landscape of sand dunes under a starry night sky",
    "A cute baby dragon sleeping on a pile of treasure, 3d render, pixar style",
    "Abstract geometric patterns with neon colors, 4k wallpaper"
];

export const getRandomPrompt = () => {
    return popularPrompts[Math.floor(Math.random() * popularPrompts.length)];
};

export const IMAGE_MODELS = {
    POLLINATIONS: {
        id: 'pollinations',
        name: 'Pollinations AI (Free)',
        description: 'Great for quick ideas and testing. No key required.',
        type: 'url'
    },
    SD3_5: {
        id: 'sd3.5',
        name: 'Stable Diffusion 3 Medium (NVIDIA)',
        description: 'State-of-the-art quality. Requires API Key.',
        type: 'api',
        defaultEndpoint: 'https://ai.api.nvidia.com/v1/genai/stabilityai/stable-diffusion-3-medium',
        localEndpoint: 'http://localhost:8000/v1/infer'
    }
};

export const CHAT_MODELS = {
    PRIMARY: "meta-llama/llama-3.2-11b-vision-instruct:free",   // Vision model - Llama 3.2
    SECONDARY: "qwen/qwen2.5-vl-7b-instruct:free",              // Backup Vision - Qwen VL
    FALLBACK: "google/gemma-3-4b-it:free",                      // Backup Text (Lightweight)
    DISPLAY: {
        DEFAULT: "AI Assistant (Auto-Switching)",
        FALLBACK_NOTE: "\n\n*(Note: Vision unavailable, switched to text-only mode)*"
    }
};
