# Sales Order Monitor

A responsive React dashboard for monitoring the fictional sales-order dataset supplied for the Harrison's technical assessment.

## Run locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Create a production build with `npm run build`, or run the API contract checks with `npm test`.

## Architecture and API integration

- React + Vite single-page app with no router, state library, or UI framework.
- The browser calls only `https://hiring.harrisons.my/api/mock/sales-orders` using the provided assessment header.
- Search, site/status filters, sorting, page size, and pagination are sent to the API as query parameters; the 1,200-row fixture is never bundled into the UI.
- Summary cards use the API's `summary` object. “Completed” combines invoiced and delivered counts.
- Requests are abortable, search is debounced, and the interface includes loading skeletons, an empty state, and a retryable error state.
- Desktop uses a data table; smaller screens switch to touch-friendly order cards.

The API key is intentionally present in client code because it is the public, read-only assessment credential provided with the brief. No database or additional backend is used.

## AI use and testing

OpenAI Codex was used to inspect the supplied API contract, scaffold the React/Vite UI, and review responsive and error-state behavior. The implementation was kept deliberately small and was verified with:

- Node's built-in test runner against the live mock API (`npm test`).
- Vite's production build (`npm run build`).
- Manual desktop and mobile-width browser checks, including search, filters, sorting, pagination, empty results, and refresh.

## Limitations

- The dashboard is read-only because the assessment API accepts only `GET` and `OPTIONS`.
- Summary totals are global values supplied by the API; `filtered_orders` is shown in the listing heading when filters are active.
- External font loading falls back to the local system font if Google Fonts is unavailable.
