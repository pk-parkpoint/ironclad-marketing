# Ironclad CMS Seed Data

Generated seed data for Sanity CMS import, sourced from:

- `frontend/lib/ironclad-data.ts`
- `websites/ironclad/content/services.ts`
- `websites/ironclad/content/locations.ts`
- `websites/ironclad/content/blog-posts.ts`

## Generate

```bash
cd websites/ironclad
npx tsx scripts/generate-sanity-seed.ts
```

## Import to Sanity

```bash
cd websites/ironclad
sanity dataset import content/cms-seed/ironclad-seed.ndjson "$NEXT_PUBLIC_SANITY_DATASET" --replace
```

## Output

- `ironclad-seed.ndjson`
- `seed-summary.json`

The generated payload includes:

- 10 service documents
- 19 location documents
- 80+ FAQ documents
- company singleton
- reviews, blog posts, team members, and special offers
