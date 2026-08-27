# Ironclad Google Ads Search Runbook

Last updated: 2026-08-26

## Account and launch contract

- Manager account: `457-337-5000`
- Ironclad customer: `480-357-2715`
- Public phone: `(512) 506-2470`
- License: `RMP #39871`
- Conversion-first launch: Emergency, Water Heater, Drain & Sewer, Leaks &
  Lines, and General & City share one `$60/day` budget
- The five core campaigns use one Maximize Conversions portfolio strategy with
  a `$40` target CPA and a `$15` CPC ceiling
- Freeze and Competitor remain paused
- Freeze: built at `$75/day`, paused until the Austin forecast is below 32°F
- Competitor: built at `$10/day`, paused until explicitly approved
- The legacy Performance Max campaign is excluded from every reconciler mutation and remains paused.

The checked-in manifest is the source of truth for campaigns, ad groups, keywords, ads, URLs, budgets, CPC caps, locations, negatives, and assets. It uses exact and phrase match only.

## Safe commands

Read-only validation and audit:

```zsh
npm run google-ads:validate
npm run google-ads:plan
npm run google-ads:audit
npm run google-ads:copy-plan
npm run google-ads:landing-urls-plan
npm run google-ads:services-plan
npm run google-ads:images-plan
npm run google-ads:conversion-restart-plan
npm run google-ads:landing-pages-audit
npm run google-ads:landing-pages-audit-live
```

Replace only responsive Search ad copy while requiring the five live campaigns
to stay enabled and Freeze plus Competitor to stay paused. The command creates
and verifies each replacement before retiring approved serving copy. While a
replacement is under review, it retains an approved serving ad and removes only
superseded non-serving review variants; it does not change campaigns, budgets,
bids, keywords, targeting, or image links:

```zsh
npm run google-ads:copy-apply -- --confirm-customer=4803572715
```

Apply only explicit keyword landing-page overrides from the manifest. This
command validates campaign status, writes only changed keyword final URLs, and
verifies that shared budgets and every managed campaign status stayed intact:

```zsh
npm run google-ads:landing-urls-apply -- --confirm-customer=4803572715
```

Add or reconcile only the tightly qualified water-softener and
garbage-disposal service groups. This command requires all managed campaigns
to remain paused, preserves live budgets and existing shared/campaign
negatives, does not touch image links, and verifies exact-match service terms
plus ad-group negatives after applying:

```zsh
npm run google-ads:services-apply -- --confirm-customer=4803572715
```

Upload and reconcile only the 16 user-supplied square and landscape images
across every managed ad group. This command refuses to run unless all managed
campaigns remain paused, validates every exact image link before writing,
preserves live budgets and every keyword/negative set, and verifies all image
links plus policy-review state after applying:

```zsh
npm run google-ads:images-apply -- --confirm-customer=4803572715
```

Launch the five core Search campaigns on one shared budget and portfolio bid
strategy. This command sets the shared budget to `$60/day`, applies a `$40`
target CPA and `$15` CPC ceiling, keeps Freeze and Competitor paused, changes
Calls from ads to one conversion per click, reconciles the current logo from
`app/icon.svg`, and proves that positive keywords and ad-group images did not
change. It also reconciles the complete negative-keyword manifest before
activation:

```zsh
npm run google-ads:conversion-restart-apply -- --confirm-customer=4803572715
```

Google Ads business logos accept raster uploads, not SVG files. The sync renders
the canonical `app/icon.svg` mark to a 1200x1200 PNG, creates a versioned asset,
removes prior account and managed-campaign logo associations, and attaches the
current asset at both levels.

Audit every ad-group URL, keyword URL override, and sitelink against production:

```zsh
npm run google-ads:landing-pages-audit
```

Reconcile the build while keeping every managed campaign paused:

```zsh
npm run google-ads:apply -- --confirm-customer=4803572715
```

Reapply the manifest launch statuses after production verification:

```zsh
npm run google-ads:activate -- --confirm-customer=4803572715
npm run google-ads:audit -- --expect-launch
```

The customer confirmation is required for every write or activation command. The developer token is read from Secret Manager and must never be committed.

## Production verification

Before activation, confirm all of the following:

- Production HTML contains `(512) 506-2470`, `RMP #39871`, and `AW-18207846861`.
- The website-call tag config includes the generated website-call conversion label and `phone_conversion_number` set to `(512) 506-2470`.
- A successful booking emits one booking conversion with the booking ID as `transaction_id`.
- Mobile landing pages show sticky Call and Book Online actions; the emergency page is call-only above the fold.
- Every final URL in the manifest returns a successful landing page after redirects.
- Call reporting is enabled and the Calls from ads conversion requires 60 seconds.
- Booking confirmed, Calls from ads, and Calls from website are the custom campaign goal. Page views and phone taps are not bidding goals.

After activation, inspect the Search Terms and user-location reports daily for the first two weeks. Add negatives for irrelevant intent; do not broaden keyword match types.

## Required UI-only checks

The Google Ads API does not expose reliable write controls for every account UI setting. Verify these in the manager UI before and after launch:

- Expert mode is active.
- Every auto-apply recommendation category is off.
- Automatically created account assets are off.
- Dynamic business assets and dynamic sitelinks are off.
- The Google Business Profile location asset is linked and shows `(512) 506-2470`.
- Call recording, where available and legally appropriate, is configured in the UI.

Campaign-level AI Max, final URL expansion/text automation, Search Partners, Display, presence-only location targeting, CPC limits, and custom conversion goals are API-managed and audit-enforced.

## Image-asset contract

The supplied-photo library preserves eight untouched WebP originals and
provides a 1200×1200 square plus a 1200×628 landscape asset for each. The
image-only reconciler attaches all 16 variants to all 31 managed ad groups, as
explicitly approved on 2026-08-26. It replaces older `AD_IMAGE` links but does
not alter campaign assets, ads, keywords, negatives, bids, budgets, targeting,
Display, or Performance Max. Always inspect the policy readback after apply;
new assets may remain under review before Google serves them.

Live checkpoint on 2026-08-26: all 16 supplied assets were uploaded and all
496 intended links read back as enabled (16 per managed ad group). The asset
policy fields were still `UNKNOWN` immediately after creation, so recheck them
after Google begins review.
