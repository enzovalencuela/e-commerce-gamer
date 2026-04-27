import type { Product } from "../types/Product";

const PRODUCT_CACHE_KEY = "products_cache_v1";
const PRODUCT_CACHE_TTL = 5 * 60 * 1000;

interface ProductCachePayload {
  timestamp: number;
  products: Product[];
}

export function loadProductCache(): ProductCachePayload | null {
  try {
    const raw = localStorage.getItem(PRODUCT_CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ProductCachePayload;
  } catch {
    return null;
  }
}

export function saveProductCache(products: Product[]) {
  try {
    const payload: ProductCachePayload = {
      timestamp: Date.now(),
      products,
    };
    localStorage.setItem(PRODUCT_CACHE_KEY, JSON.stringify(payload));
  } catch {
    // ignore cache errors
  }
}

export function isProductCacheFresh(cache: ProductCachePayload | null) {
  return Boolean(cache && Date.now() - cache.timestamp < PRODUCT_CACHE_TTL);
}

export async function fetchProductsWithCache(
  baseUrl: string
): Promise<{ products: Product[]; fromCache: boolean }> {
  const cache = loadProductCache();

  if (isProductCacheFresh(cache) && cache) {
    return { products: cache.products, fromCache: true };
  }

  const response = await fetch(`${baseUrl}/api/products`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Erro ao buscar produtos.");
  }

  const products: Product[] = await response.json();
  saveProductCache(products);
  return { products, fromCache: false };
}
