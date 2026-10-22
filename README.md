# Sticki product explorer

Public, mobile-first GitHub Pages product catalog. Collection order: Series 3 / Sticki Mates, Minecraft, Aphmau, Stitch Series 2. Retail links and images researched from the official Sticki Rolls site and retailer product pages on October 22, 2026. Aphmau currently has two verified US product types, rather than invented variants.

## QR destinations

- Bracelet: https://danhues.github.io/sticki-product-explorer/?source=bracelet
- Packaging: https://danhues.github.io/sticki-product-explorer/?source=packaging
- Booth: https://danhues.github.io/sticki-product-explorer/?source=booth

Use these URLs as QR destinations. All show the same catalog; the placement is included in the separate staff Product Explorer report. Product images are illustrative, especially assorted mystery products. Retailer availability may change.

## Updating products

Edit `catalog.json` for descriptions, images and exact retailer URLs. Stable product IDs, collection and retailer must also match the staff service's `lib/product-catalog.mjs`. Do not reuse an ID for a different SKU. Assets are served locally. Source provenance is in `asset-sources.json` plus the retailer URLs in the catalog.

## Analytics

Uses the existing staff service's `/api/product-event` endpoint. Each page view and outbound click has a unique event ID; retries are deduplicated. A random visitor ID and a bounded pending-event queue are saved locally. Localhost previews do not send production events. Failed events retry on return/online and every 30 seconds. Counts are not sales or verified people. Clearing browser storage changes the identifier. The staff report is authenticated and product events are stored separately from social clicks and reward claims.

Deploy from `main`, root, with GitHub Pages. No build step or secrets are needed in this repository.
