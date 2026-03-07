# CMS Setup (Sanity)

## Schemas Included

- `service`
- `location`
- `review`
- `faq`
- `blogPost`
- `specialOffer`
- `teamMember`
- `companyInfo` (singleton)

## Run Studio

```bash
cd websites/ironclad
npm run sanity:dev
```

Studio default URL: `http://localhost:3333`

## Singleton Behavior

`companyInfo` is configured as a singleton document in `sanity/structure/index.ts`.

## Required Environment Variables

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`

## Seed Content (IC-004)

Generate and import seed data:

```bash
cd websites/ironclad
npm run cms:seed
sanity dataset import content/cms-seed/ironclad-seed.ndjson "$NEXT_PUBLIC_SANITY_DATASET" --replace
```

Seed output includes:

- 10 services
- 19 locations
- 90+ FAQs
- company singleton
