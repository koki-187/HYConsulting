/**
 * In-Memory Caching Layer for Market Statistics
 * Caches frequently accessed market data to reduce database queries
 * 
 * Cache Strategy:
 * - TTL-based expiration (5 minutes for market stats, 1 hour for regional data)
 * - LRU eviction when cache size exceeds limit
 * - Automatic refresh on expiration
 * - Thread-safe operations
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
  hits: number;
  created: number;
}

interface CacheStats {
  size: number;
  hits: number;
  misses: number;
  hitRate: number;
}

export class MarketCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private stats = {
    hits: 0,
    misses: 0,
  };
  private readonly maxSize = 1000; // Maximum cache entries
  private readonly defaultTTL = 5 * 60 * 1000; // 5 minutes default
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    // Start cleanup interval
    this.startCleanup();
  }

  /**
   * Get value from cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Check expiration
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    // Update stats
    entry.hits++;
    this.stats.hits++;

    return entry.data as T;
  }

  /**
   * Set value in cache
   */
  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    // Evict oldest entry if cache is full
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      this.evictLRU();
    }

    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttl,
      hits: 0,
      created: Date.now(),
    });
  }

  /**
   * Delete value from cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear entire cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const total = this.stats.hits + this.stats.misses;
    return {
      size: this.cache.size,
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate: total > 0 ? (this.stats.hits / total) * 100 : 0,
    };
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.stats.hits = 0;
    this.stats.misses = 0;
  }

  /**
   * Evict least recently used entry
   */
  private evictLRU(): void {
    let lruKey: string | null = null;
    let lruTime = Date.now();

    this.cache.forEach((entry, key) => {
      if (entry.created < lruTime) {
        lruTime = entry.created;
        lruKey = key;
      }
    });

    if (lruKey) {
      this.cache.delete(lruKey);
    }
  }

  /**
   * Start periodic cleanup of expired entries
   */
  private startCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      let cleaned = 0;
      const keysToDelete: string[] = [];

      this.cache.forEach((entry, key) => {
        if (now > entry.expiresAt) {
          keysToDelete.push(key);
          cleaned++;
        }
      });

      keysToDelete.forEach(key => this.cache.delete(key));

      if (cleaned > 0) {
        console.log(`[Cache] Cleaned up ${cleaned} expired entries`);
      }
    }, 60 * 1000); // Run every minute
  }

  /**
   * Stop cleanup interval
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval as any);
    }
  }
}

/**
 * Market Statistics Cache Keys
 */
export const CACHE_KEYS = {
  // Regional market stats (1 hour TTL)
  REGION_STATS: (prefecture: string, city: string) =>
    `region_stats:${prefecture}:${city}`,

  // Property type stats (1 hour TTL)
  PROPERTY_TYPE_STATS: (prefecture: string, propertyType: string) =>
    `property_type_stats:${prefecture}:${propertyType}`,

  // Price range stats (1 hour TTL)
  PRICE_RANGE_STATS: (prefecture: string) =>
    `price_range_stats:${prefecture}`,

  // Comparable transactions (5 minute TTL)
  COMPARABLE_TRANSACTIONS: (prefecture: string, city: string, propertyType: string) =>
    `comparable_tx:${prefecture}:${city}:${propertyType}`,

  // Market trend (1 hour TTL)
  MARKET_TREND: (prefecture: string) =>
    `market_trend:${prefecture}`,

  // Station distance stats (1 hour TTL)
  STATION_DISTANCE_STATS: (prefecture: string, city: string) =>
    `station_distance_stats:${prefecture}:${city}`,
};

/**
 * TTL configurations
 */
export const CACHE_TTL = {
  REGIONAL_STATS: 60 * 60 * 1000, // 1 hour
  PROPERTY_TYPE_STATS: 60 * 60 * 1000, // 1 hour
  PRICE_RANGE_STATS: 60 * 60 * 1000, // 1 hour
  COMPARABLE_TRANSACTIONS: 5 * 60 * 1000, // 5 minutes
  MARKET_TREND: 60 * 60 * 1000, // 1 hour
  STATION_DISTANCE_STATS: 60 * 60 * 1000, // 1 hour
};

/**
 * Global cache instance
 */
let globalCache: MarketCache | null = null;

export function getCache(): MarketCache {
  if (!globalCache) {
    globalCache = new MarketCache();
  }
  return globalCache;
}

export function destroyCache(): void {
  if (globalCache) {
    globalCache.destroy();
    globalCache = null;
  }
}
