// Metadata fetching and caching utilities for IPPY NFTs and Blind Boxes

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  external_url?: string;
  background_color?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
  // Additional fields for enhanced display
  tokenId?: number;
  nftType?: number;
  rarity?: string;
  theme?: string;
}

export interface BlindBoxMetadata extends NFTMetadata {
  svg?: string; // Extracted SVG for display
  isOnChain: true;
}

export interface MetadataCache {
  [key: string]: {
    metadata: NFTMetadata;
    timestamp: number;
    expires: number;
  };
}

// Cache duration in milliseconds (1 hour)
const CACHE_DURATION = 60 * 60 * 1000;
const CACHE_KEY = "ippy_metadata_cache";

class MetadataService {
  private cache: MetadataCache = {};

  constructor() {
    this.loadCache();
  }

  // Load cache from localStorage
  private loadCache() {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          this.cache = JSON.parse(cached);
          // Clean expired entries
          this.cleanExpiredCache();
        }
      } catch (error) {
        console.warn("Failed to load metadata cache:", error);
        this.cache = {};
      }
    }
  }

  // Save cache to localStorage
  private saveCache() {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(this.cache));
      } catch (error) {
        console.warn("Failed to save metadata cache:", error);
      }
    }
  }

  // Clean expired cache entries
  private cleanExpiredCache() {
    const now = Date.now();
    Object.keys(this.cache).forEach((key) => {
      if (this.cache[key].expires < now) {
        delete this.cache[key];
      }
    });
  }

  // Get from cache if not expired
  private getFromCache(key: string): NFTMetadata | null {
    const cached = this.cache[key];
    if (cached && cached.expires > Date.now()) {
      return cached.metadata;
    }
    return null;
  }

  // Store in cache
  private setCache(key: string, metadata: NFTMetadata) {
    this.cache[key] = {
      metadata,
      timestamp: Date.now(),
      expires: Date.now() + CACHE_DURATION,
    };
    this.saveCache();
  }

  // Parse base64 encoded JSON metadata (for blind boxes)
  private parseBase64Metadata(dataUri: string): BlindBoxMetadata | null {
    try {
      // Extract base64 part from data URI
      const base64Match = dataUri.match(/data:application\/json;base64,(.+)/);
      if (!base64Match) {
        throw new Error("Invalid data URI format");
      }

      // Decode base64
      const jsonString = atob(base64Match[1]);
      const metadata = JSON.parse(jsonString) as NFTMetadata;

      // Extract SVG if it's a data URI
      let svg: string | undefined;
      if (metadata.image?.startsWith("data:image/svg+xml;base64,")) {
        const svgBase64 = metadata.image.split(",")[1];
        svg = atob(svgBase64);
      }

      return {
        ...metadata,
        svg,
        isOnChain: true,
      } as BlindBoxMetadata;
    } catch (error) {
      console.error("Failed to parse base64 metadata:", error);
      return null;
    }
  }

  // Fetch JSON metadata from URL (for IPPY NFTs)
  private async fetchJsonMetadata(url: string): Promise<NFTMetadata | null> {
    try {
      // Add cache busting and timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          "Cache-Control": "max-age=3600", // 1 hour cache
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const metadata = await response.json();

      // Validate required fields
      if (!metadata.name || !metadata.description) {
        throw new Error("Invalid metadata: missing required fields");
      }

      return metadata as NFTMetadata;
    } catch (error) {
      console.error(`Failed to fetch metadata from ${url}:`, error);
      return null;
    }
  }

  // Main function to get NFT metadata
  async getIPPYMetadata(
    tokenId: number,
    tokenURI: string,
    nftType: number
  ): Promise<NFTMetadata | null> {
    const cacheKey = `ippy_${tokenId}_${tokenURI}`;

    // Check cache first
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return { ...cached, tokenId, nftType };
    }

    try {
      let metadata: NFTMetadata | null = null;

      if (tokenURI.startsWith("data:")) {
        // Handle on-chain/base64 encoded metadata
        metadata = this.parseBase64Metadata(tokenURI);
      } else {
        // Handle URL-based metadata (IPFS, HTTP, etc.)
        metadata = await this.fetchJsonMetadata(tokenURI);
      }

      if (metadata) {
        // Enhance with contract data
        const enhancedMetadata = {
          ...metadata,
          tokenId,
          nftType,
          rarity: nftType === 0 ? "hidden" : "standard",
          theme: this.getThemeFromNFTType(nftType),
        };

        // Cache the result
        this.setCache(cacheKey, enhancedMetadata);
        return enhancedMetadata;
      }

      return null;
    } catch (error) {
      console.error("Error fetching IPPY metadata:", error);
      return null;
    }
  }

  // Get blind box metadata (always on-chain)
  async getBlindBoxMetadata(uri: string): Promise<BlindBoxMetadata | null> {
    const cacheKey = `blindbox_${uri}`;

    // Check cache first
    const cached = this.getFromCache(cacheKey) as BlindBoxMetadata | null;
    if (cached) {
      return cached;
    }

    try {
      const metadata = this.parseBase64Metadata(uri);
      if (metadata) {
        // Cache the result
        this.setCache(cacheKey, metadata);
        return metadata;
      }
      return null;
    } catch (error) {
      console.error("Error parsing blind box metadata:", error);
      return null;
    }
  }

  // Helper to get theme name from NFT type
  private getThemeFromNFTType(nftType: number): string {
    const themes = {
      0: "Hidden",
      1: "Nature",
      2: "Tech",
      3: "Art",
      4: "Music",
      5: "Sports",
      6: "Gaming",
    };
    return themes[nftType as keyof typeof themes] || "Unknown";
  }

  // Batch fetch multiple NFT metadata
  async batchGetIPPYMetadata(
    nfts: Array<{ tokenId: number; tokenURI: string; nftType: number }>
  ): Promise<Array<NFTMetadata | null>> {
    // Process in parallel with concurrency limit
    const BATCH_SIZE = 5;
    const results: Array<NFTMetadata | null> = [];

    for (let i = 0; i < nfts.length; i += BATCH_SIZE) {
      const batch = nfts.slice(i, i + BATCH_SIZE);
      const batchPromises = batch.map((nft) =>
        this.getIPPYMetadata(nft.tokenId, nft.tokenURI, nft.nftType)
      );

      const batchResults = await Promise.allSettled(batchPromises);
      batchResults.forEach((result) => {
        results.push(result.status === "fulfilled" ? result.value : null);
      });
    }

    return results;
  }

  // Clear cache manually
  clearCache() {
    this.cache = {};
    if (typeof window !== "undefined") {
      localStorage.removeItem(CACHE_KEY);
    }
  }

  // Get cache stats
  getCacheStats() {
    const now = Date.now();
    const entries = Object.keys(this.cache);
    const valid = entries.filter((key) => this.cache[key].expires > now);

    return {
      totalEntries: entries.length,
      validEntries: valid.length,
      expiredEntries: entries.length - valid.length,
      cacheSize: JSON.stringify(this.cache).length,
    };
  }
}

// Export singleton instance
export const metadataService = new MetadataService();

// Utility functions for components
export const isIPFSUrl = (url: string): boolean => {
  return url.includes("ipfs") || url.startsWith("ipfs://");
};

export const getImageDisplayUrl = (imageUrl: string): string => {
  // Handle IPFS URLs - convert to gateway URL if needed
  if (imageUrl.startsWith("ipfs://")) {
    return imageUrl.replace("ipfs://", "https://ipfs.io/ipfs/");
  }
  return imageUrl;
};

export const getMetadataDisplayName = (metadata: NFTMetadata): string => {
  return metadata.name || `NFT #${metadata.tokenId}`;
};

export const getMetadataDescription = (metadata: NFTMetadata): string => {
  return metadata.description || "No description available";
};

export const getRarityColor = (rarity?: string): string => {
  const colors = {
    hidden: "from-purple-500 to-pink-500",
    legendary: "from-yellow-400 to-orange-500",
    epic: "from-purple-400 to-indigo-500",
    rare: "from-blue-400 to-cyan-500",
    standard: "from-gray-400 to-gray-500",
  };
  return colors[rarity as keyof typeof colors] || colors.standard;
};
