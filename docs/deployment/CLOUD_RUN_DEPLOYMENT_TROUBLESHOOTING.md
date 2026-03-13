# Cloud Run Deployment Troubleshooting

## Known issue

The source-based Cloud Run deploy path can fail even when the app itself builds locally. When that happens, do not keep retrying blind from the damaged state.

## Working fallback

1. Build the production image locally.
2. Push the image to Artifact Registry.
3. Deploy that image directly to the `ironclad-marketing` Cloud Run service in `us-central1`.
4. Invalidate edge cache after deploy if stale guide routes keep serving.

## Why this exists

A prior local clone became corrupted during guide work. Remote GitHub state and Cloud Run service history were intact. Re-cloning the repo resolved the Git object damage. Deployment should only proceed from a clean clone on a feature branch.

## Rules for future engineers

- Never deploy from `main` with local-only changes.
- Never trust a damaged clone; re-clone first.
- Run `npm run lint` and `npm run build` before deploy.
- Verify representative guide URLs after deploy, not just the homepage.
