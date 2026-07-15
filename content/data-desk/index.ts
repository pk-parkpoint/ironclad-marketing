import { DATA_DESK_CATEGORIES } from "./categories";
import { LIVE_RISK_PRODUCTS } from "./products-live";
import { MARKET_AND_PROPERTY_PRODUCTS } from "./products-market-property";
import { TOOL_AND_PARTNER_PRODUCTS } from "./products-tools-partners";
import type { DataDeskCategoryId, DataDeskProduct } from "./types";

export type { DataDeskCategory, DataDeskCategoryId, DataDeskProduct } from "./types";

export const DATA_DESK_HUB_PATH = "/data";
export const DATA_DESK_HUB_TITLE = "Austin Home Data Desk";
export const DATA_DESK_HUB_DESCRIPTION =
  "Explore 25 planned Austin data products for home-system costs, risks, permits, water conditions and homeowner decisions.";

export const DATA_DESK_PRODUCTS: DataDeskProduct[] = [
  ...LIVE_RISK_PRODUCTS,
  ...MARKET_AND_PROPERTY_PRODUCTS,
  ...TOOL_AND_PARTNER_PRODUCTS,
].sort((a, b) => a.rank - b.rank);

export const DATA_DESK_PRODUCT_BY_SLUG = new Map(DATA_DESK_PRODUCTS.map((product) => [product.slug, product]));
export const DATA_DESK_CATEGORY_BY_ID = new Map(DATA_DESK_CATEGORIES.map((category) => [category.id, category]));

export function getDataDeskProductsByCategory(categoryId: DataDeskCategoryId): DataDeskProduct[] {
  return DATA_DESK_PRODUCTS.filter((product) => product.category === categoryId);
}

export function getDataDeskRelatedProducts(product: DataDeskProduct, limit = 4): DataDeskProduct[] {
  const sameCategory = DATA_DESK_PRODUCTS.filter(
    (candidate) => candidate.slug !== product.slug && candidate.category === product.category,
  );
  const adjacent = DATA_DESK_PRODUCTS.filter(
    (candidate) => candidate.slug !== product.slug && candidate.category !== product.category,
  ).sort((a, b) => Math.abs(a.rank - product.rank) - Math.abs(b.rank - product.rank));

  return [...sameCategory, ...adjacent].slice(0, limit);
}

export { DATA_DESK_CATEGORIES } from "./categories";
