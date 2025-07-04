"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Loader2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { GachaItemWithCount, COLLECTION_COLORS, VERSION_STYLES, COLLECTION_GLOW } from "./types"
import {
    getItemDisplayName,
    getItemDisplayDescription,
    getRarityInfo,
    getItemDisplayStyle,
    hasRichMetadata,
    getItemTheme
} from "@/types/gacha"
import { useState, useEffect } from "react"
import Image from "next/image"
import { metadataMapping } from "@/lib/metadataMapping"

interface GridViewProps {
    items: GachaItemWithCount[]
    inventoryLength: number
}

interface ImageCache {
    [itemId: string]: {
        imageUrl: string | null;
        loading: boolean;
        error: boolean;
    }
}

export function GridView({ items, inventoryLength }: GridViewProps) {
    const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
    const [imageCache, setImageCache] = useState<ImageCache>({});

    const fetchIPFSJson = async (tokenURI: string) => {
        try {
            const response = await fetch(tokenURI, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Origin': 'https://ippygacha.vercel.app/',
                    'Cache-Control': 'no-cache',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const metadata = await response.json();

            return metadata.image;
        } catch (error) {
            console.error('Error fetching IPFS JSON:', error);
            return null;
        }
    };

    // Fetch images for all items when they change
    useEffect(() => {
        const fetchAllImages = async () => {
            const promises = items.map(async (item) => {
                // Skip if already cached or no tokenURI
                if (!item.tokenURI || imageCache[item.id]) {
                    return;
                }

                // Set loading state
                setImageCache(prev => ({
                    ...prev,
                    [item.id]: { imageUrl: null, loading: true, error: false }
                }));

                try {
                    const imageUrl = await fetchIPFSJson(item.tokenURI);

                    setImageCache(prev => ({
                        ...prev,
                        [item.id]: { imageUrl, loading: false, error: !imageUrl }
                    }));
                } catch (error) {
                    console.error(`Error fetching image for ${item.name}:`, error);
                    setImageCache(prev => ({
                        ...prev,
                        [item.id]: { imageUrl: null, loading: false, error: true }
                    }));
                }
            });

            await Promise.all(promises);
        };

        fetchAllImages();
    }, [items, imageCache]);

    const handleImageError = (itemId: string) => {
        setImageErrors(prev => new Set([...prev, itemId]));
    };

    if (items.length === 0) {
        return (
            <Card className="bg-white/80 border-slate-200 shadow-lg backdrop-blur-sm">
                <CardContent className="p-16 text-center">
                    <Package className="w-20 h-20 text-slate-300 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-slate-700 mb-3">No Items Found</h3>
                    <p className="text-slate-500 text-lg">
                        {inventoryLength === 0
                            ? "Your collection is empty. Start pulling some gacha to build your collection!"
                            : "No items match your current filters. Try adjusting your search criteria."}
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {items.map((item, index) => {
                const rarityInfo = getRarityInfo(item);
                const imageUrl = metadataMapping[item.name.toLowerCase() as keyof typeof metadataMapping]
                const imageData = imageCache[item.id];
                const hasValidImage = imageData?.imageUrl && !imageErrors.has(item.id);

                return (
                    <Card
                        key={index}
                        className={cn(
                            "transition-all duration-300 cursor-pointer border-2 shadow-lg hover:shadow-xl hover:scale-105 relative overflow-hidden",
                            // Use metadata-based styling if available
                            hasRichMetadata(item) ? getItemDisplayStyle(item) : COLLECTION_COLORS.ippy,
                            VERSION_STYLES[item.version],
                            COLLECTION_GLOW.ippy,
                            // Enhanced styling for hidden/rare items
                            item.version === "hidden" && "ring-2 ring-purple-400/50 shadow-purple-200/50",
                            // Loading state styling
                            (item.metadataLoading || imageData?.loading) && "opacity-75"
                        )}
                    >
                        {/* Loading overlay for metadata */}
                        {(item.metadataLoading || imageData?.loading) && (
                            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
                                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                            </div>
                        )}

                        <CardHeader className="pb-2">
                            {/* Image display */}
                            <div className="relative w-full h-32 mb-2 rounded-lg overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                                {imageUrl ? (
                                    <Image
                                        src={imageUrl}
                                        alt={getItemDisplayName(item)}
                                        className="w-full h-full object-cover"
                                        onError={() => handleImageError(item.id)}
                                        width={128}
                                        height={128}
                                        loading="lazy"
                                    />
                                ) : imageData?.error ? (
                                    // Error state
                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                                        <AlertCircle className="w-8 h-8 mb-2" />
                                        <span className="text-xs text-center">Failed to load</span>
                                    </div>
                                ) : imageData?.loading ? (
                                    // Loading state
                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                                        <Loader2 className="w-8 h-8 mb-2 animate-spin" />
                                        <span className="text-xs">Loading...</span>
                                    </div>
                                ) : (
                                    // Fallback to emoji
                                    <div className="w-full h-full flex items-center justify-center text-4xl">
                                        {item.emoji || "🎁"}
                                    </div>
                                )}

                                {/* Rarity gradient overlay for special items */}
                                {item.version === "hidden" && (
                                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent pointer-events-none" />
                                )}
                            </div>

                            <CardTitle className="text-sm md:text-base text-center font-bold leading-tight">
                                {getItemDisplayName(item)}
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="pt-0 space-y-2">
                            <p className="text-xs text-center opacity-80 leading-relaxed line-clamp-2">
                                {getItemDisplayDescription(item)}
                            </p>

                            {/* Collection and Rarity badges */}
                            <div className="flex justify-between items-center gap-1">
                                <Badge
                                    variant="secondary"
                                    className="text-xs font-bold bg-blue-100 text-blue-800 border-blue-300 flex-shrink-0"
                                >
                                    IPPY
                                </Badge>
                                <Badge
                                    className={cn(
                                        "text-xs font-bold px-2 py-0.5 flex-shrink-0",
                                        `bg-gradient-to-r ${rarityInfo.color}`,
                                        "text-white border-white/30 shadow-sm"
                                    )}
                                >
                                    {rarityInfo.label.toUpperCase()}
                                </Badge>
                            </div>

                            {/* Count badge */}
                            <div className="text-center">
                                <Badge
                                    variant="outline"
                                    className={cn(
                                        "text-sm font-bold px-3 py-1",
                                        item.version === "hidden"
                                            ? "border-white/50 text-white bg-white/20"
                                            : "border-slate-400 text-slate-700 bg-slate-50",
                                    )}
                                >
                                    ×{item.count}
                                </Badge>
                            </div>

                            {/* Attributes preview (show top 2) */}
                            {hasRichMetadata(item) && item.metadata.attributes && item.metadata.attributes.length > 0 && (
                                <div className="space-y-1 mt-2 pt-2 border-t border-slate-200/50">
                                    {item.metadata.attributes.slice(0, 2).map((attr, attrIndex) => (
                                        <div key={attrIndex} className="flex justify-between items-center text-xs">
                                            <span className="text-slate-500 truncate flex-shrink-0 mr-1">
                                                {attr.trait_type}:
                                            </span>
                                            <span className="font-medium text-slate-700 truncate">
                                                {attr.value}
                                            </span>
                                        </div>
                                    ))}
                                    {item.metadata.attributes.length > 2 && (
                                        <div className="text-xs text-slate-400 text-center pt-1">
                                            +{item.metadata.attributes.length - 2} more
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    )
} 