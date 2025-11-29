import { AppDataSource } from "../data-source";
import { Tenant } from "../entity/Tenant";

class TenantCacheService {
  private cache: Map<string, { isActive: boolean; lastUpdated: number }> = new Map();
  private readonly CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

  /**
   * Validate if a tenant exists and is active
   * Uses cache to avoid database queries on every request
   */
  async validateTenant(tenantId: string): Promise<boolean> {
    const cached = this.cache.get(tenantId);
    const now = Date.now();

    // Return cached value if it's still valid
    if (cached && (now - cached.lastUpdated) < this.CACHE_TTL) {
      return cached.isActive;
    }

    // Fetch from database if cache is expired or doesn't exist
    try {
      const tenantRepository = AppDataSource.getRepository(Tenant);
      const tenant = await tenantRepository.findOne({ where: { name: tenantId } });

      const isActive = tenant ? tenant.isActive : false;

      // Update cache
      this.cache.set(tenantId, {
        isActive,
        lastUpdated: now,
      });

      return isActive;
    } catch (error) {
      console.error("Error validating tenant:", error);
      return false;
    }
  }

  /**
   * Invalidate cache for a specific tenant
   * Useful when tenant status changes
   */
  invalidate(tenantId: string): void {
    this.cache.delete(tenantId);
  }

  /**
   * Clear entire cache
   */
  clearAll(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.entries()).map(([key, value]) => ({
        tenantId: key,
        isActive: value.isActive,
        age: Date.now() - value.lastUpdated,
      })),
    };
  }
}

// Export singleton instance
export const tenantCacheService = new TenantCacheService();
