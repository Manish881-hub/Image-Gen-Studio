import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useUser } from '@clerk/clerk-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Trash2, Copy, ExternalLink, ImageIcon } from 'lucide-react';

export function Gallery() {
    const { user } = useUser();
    const images = useQuery(api.images.getImages, user?.id ? { userId: user.id } : "skip");
    const deleteImage = useMutation(api.images.deleteImage);
    const [deletingId, setDeletingId] = useState(null);

    const handleDownload = async (imageUrl, prompt) => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `aether-${prompt.slice(0, 20).replace(/\s+/g, '-')}-${Date.now()}.jpg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to download image.');
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm("Delete this image?")) return;

        setDeletingId(id);
        try {
            await deleteImage({ imageId: id });
        } catch (error) {
            console.error("Failed to delete:", error);
        } finally {
            setDeletingId(null);
        }
    };

    const copyPrompt = (e, prompt) => {
        e.stopPropagation();
        navigator.clipboard.writeText(prompt);
        // Could add toast notification here
    };

    if (!images) {
        return (
            <div className="p-8 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading gallery...</p>
            </div>
        );
    }

    if (images.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8">
                <div className="bg-muted/30 p-6 rounded-full mb-6">
                    <ImageIcon className="w-12 h-12 text-muted-foreground/50" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Your gallery is empty</h2>
                <p className="text-muted-foreground mb-6 max-w-md">
                    Images you generate in the Studio will appear here. Start creating to build your collection!
                </p>
                <Button onClick={() => window.location.href = '/'}>
                    Go to Studio
                </Button>
            </div>
        );
    }

    return (
        <div className="p-6 h-full overflow-y-auto">
            <header className="mb-8 flex items-baseline justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gallery</h1>
                    <p className="text-muted-foreground">Your collection of {images.length} generated dreams</p>
                </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {images.map((img) => (
                    <Card key={img._id} className="group relative overflow-hidden bg-card/50 border-white/10 hover:border-purple-500/50 transition-all duration-300">
                        {/* Image Aspect Ratio Wrapper */}
                        <div className={`relative w-full ${img.aspectRatio === '9:16' ? 'aspect-[9/16]' :
                            img.aspectRatio === '16:9' ? 'aspect-video' : 'aspect-square'
                            }`}>
                            <img
                                src={img.url}
                                alt={img.prompt}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                <p className="text-white text-sm font-medium line-clamp-2 mb-3">{img.prompt}</p>

                                <div className="flex gap-2 justify-end">
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="h-8 w-8 bg-white/10 hover:bg-white/20 text-white border-none"
                                        onClick={(e) => copyPrompt(e, img.prompt)}
                                        title="Copy Prompt"
                                    >
                                        <Copy size={14} />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="h-8 w-8 bg-white/10 hover:bg-white/20 text-white border-none"
                                        onClick={() => handleDownload(img.url, img.prompt)}
                                        title="Download"
                                    >
                                        <Download size={14} />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="destructive"
                                        className="h-8 w-8 hover:bg-red-600/80 border-none"
                                        onClick={(e) => handleDelete(e, img._id)}
                                        disabled={deletingId === img._id}
                                        title="Delete"
                                    >
                                        {deletingId === img._id ? <span className="animate-spin">⟳</span> : <Trash2 size={14} />}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
