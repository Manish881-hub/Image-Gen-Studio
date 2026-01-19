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
