import { DATA_DESK_CATEGORIES, DATA_DESK_PRODUCTS, getDataDeskRelatedProducts } from "../content/data-desk";

const failures: string[] = [];
const ranks = new Set<number>();
const slugs = new Set<string>();

function fail(message: string) {
  failures.push(message);
}

if (DATA_DESK_PRODUCTS.length !== 25) {
  fail(`Expected 25 products, found ${DATA_DESK_PRODUCTS.length}.`);
}

for (const product of DATA_DESK_PRODUCTS) {
  const label = `#${product.rank} ${product.slug}`;
  if (ranks.has(product.rank)) fail(`${label}: duplicate rank.`);
  if (slugs.has(product.slug)) fail(`${label}: duplicate slug.`);
  ranks.add(product.rank);
  slugs.add(product.slug);

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(product.slug)) fail(`${label}: invalid URL slug.`);
  if (product.metaTitle.length < 35 || product.metaTitle.length > 65) {
    fail(`${label}: meta title is ${product.metaTitle.length} characters; expected 35–65.`);
  }
  if (product.metaDescription.length < 120 || product.metaDescription.length > 165) {
    fail(`${label}: meta description is ${product.metaDescription.length} characters; expected 120–165.`);
  }
  if (product.signals.length < 3) fail(`${label}: needs at least three planned signals.`);
  if (product.sources.length < 3) fail(`${label}: needs at least three planned sources.`);
  if (product.audiences.length < 3) fail(`${label}: needs at least three intended audiences.`);
  if (!product.guardrail.trim()) fail(`${label}: needs a scope or safety guardrail.`);

  const related = getDataDeskRelatedProducts(product);
  if (related.length !== 4) fail(`${label}: expected four related products, found ${related.length}.`);
  if (related.some((candidate) => candidate.slug === product.slug)) fail(`${label}: related products include itself.`);
}

for (let rank = 1; rank <= 25; rank += 1) {
  if (!ranks.has(rank)) fail(`Missing portfolio rank ${rank}.`);
}

for (const category of DATA_DESK_CATEGORIES) {
  if (!DATA_DESK_PRODUCTS.some((product) => product.category === category.id)) {
    fail(`Category ${category.id} has no products.`);
  }
}

if (failures.length > 0) {
  console.error("Data Desk audit failed:\n");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Data Desk audit passed: ${DATA_DESK_PRODUCTS.length} unique products, ranks 1–25, metadata and related links valid.`);
