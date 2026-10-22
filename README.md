# Sales Order Monitoring Web App

A responsive, lightweight React dashboard designed for sales teams to monitor orders, fulfillment health, and revenue across multiple regional branches. Built for the Harrison's technical assessment using the provided live mock REST API.

---

## 📋 Assessment Submission Summary

| Requirement | Details / Link |
| :--- | :--- |
| **1. Deployed Live URL** | `https://hhiv-sales-monitor.web.app` |
| **2. Public Repository URL**| `https://github.com/Subhinur/HHIV` |
| **3. Architecture Notes** | React 19 + Vite single-page application; zero-dependency vanilla CSS; native data table + mobile card layout. |
| **4. AI Disclosure & Testing**| Scaffolded and verified using AI assistance (Codex/Antigravity); tested via native `node:test` API suite, Vite production build, and comprehensive cross-viewport browser validation. |

---

## 🚀 Quick Start (Run Locally)

### Prerequisites
- **Node.js**: v20.0.0 or higher
- **npm**: v10.0.0 or higher

### Installation & Execution
```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev
# -> App will run at http://localhost:5173/

# 3. Run automated API contract tests
npm test

# 4. Create production build
npm run build
```

---

## 🎯 Requirements & Feature Matrix

| Assessment Requirement | Implementation Status | Technical Details |
| :--- | :---: | :--- |
| **1. Dashboard Summary** | ✅ Completed | 5 responsive metric cards: Total Orders (1,200), Open/Pending (420), Completed (660, combining Invoiced 360 + Delivered 300), Cancelled (120), and Total Gross Value (RM 998,244.30). |
| **2. Order Listing** | ✅ Completed | Displays `SalesId`, Customer (`SalesName` + `CustAccount`), Branch/Site (`InventSiteId` + district), Order Date (`CreatedDateTime1` in MYT), Status badge, and Amount (`HAR_TotalSOAmount` in MYR). |
| **3. Search & Filtering** | ✅ Completed | Debounced search (350ms) across customer, account, order number, and reference; dynamic status dropdown; dynamic branch dropdown; sorting by 5 fields; instant "Clear filters" action. |
| **4. API Integration** | ✅ Completed | Fully connected to `https://hiring.harrisons.my/api/mock/sales-orders` with `x-assessment-key`. Direct server-side pagination, searching, sorting, and filtering. Zero hardcoded rows. |
| **5. UX & Responsiveness** | ✅ Completed | Shimmer skeletons for loading states; clear empty state with filter reset; user-friendly error banners with retry mechanism; adaptive desktop data table and touch-friendly mobile cards. |

---

## 🏗️ Architecture & Technical Design

### 1. Minimalist, High-Performance Stack
- **Framework**: React 19 with Vite for ultra-fast HMR and bundle compilation (~320ms build time; production JS is only ~72 kB gzipped).
- **Styling**: Modern Vanilla CSS with CSS custom properties (design tokens). Avoids the bloat and build complexity of heavy CSS utility frameworks while delivering customized glassmorphic accents, color-coded badges, and fluid responsive layouts.
- **State Management**: Built with React's native primitives (`useState`, `useEffect`, `useMemo`). Avoids over-engineering with third-party stores (Redux, Zustand) for a focused monitoring interface.

### 2. Network Resilience & Async Handling
- **Request Cancellation**: Every fetch request is tied to an `AbortController`. Rapid filter changes or fast keystrokes automatically abort in-flight requests, preventing out-of-order race conditions and unnecessary network payload processing.
- **Debounced Search**: Text search is debounced at 350ms to minimize API thrashing while maintaining responsive, real-time typing feedback.
- **Dynamic Facets**: Branch and status dropdown filters are populated dynamically from the `/meta` endpoint, reflecting live backend counts.
- **Timezone & Currency Localization**: Uses standard `Intl.NumberFormat` for Malaysian Ringgit (`RM` / `MYR`) and `Intl.DateTimeFormat` pinned to `Asia/Kuala_Lumpur` timezone to ensure consistent date representations regardless of client machine settings.

### 3. Responsive Dual-Layout Strategy
- **Desktop (≥ 761px)**: High-density data table with fixed column alignment, hover states, and numeric right-alignment.
- **Mobile (≤ 760px)**: Automatically switches to touch-optimized order cards displaying key identifiers, branch badges, and timestamps without requiring horizontal table scrolling.

---

## 🔌 API Integration Details

The app communicates exclusively with the hosted assessment fixture:
- **Base Endpoint**: `https://hiring.harrisons.my/api/mock/sales-orders`
- **Metadata & Facets**: `https://hiring.harrisons.my/api/mock/sales-orders/meta`
- **Authentication**: `x-assessment-key: hssb-assessment-mock-2026`
- **Supported Query Parameters**:
  - `page`: Current page number (1-indexed)
  - `pageSize`: Number of records (10, 25, 50, 100)
  - `status`: SalesStatus filter (`Open order`, `Invoiced`, `Delivered`, `Cancelled`)
  - `site`: Branch filter (`A10`, `B20`, `C30`, `D40`, `E50`, `KK01`, `SDK02`, `TWU03`)
  - `q`: Search term against customer name, account number, sales ID, and customer reference
  - `sort` & `order`: Column sorting (`CreatedDateTime1`, `HAR_TotalSOAmount`, `SalesId`) in `asc` or `desc`

> **Note on Client Credential**: The API key is included directly in client requests as instructed in the assessment specification. It grants read-only (`GET`/`OPTIONS`) access to a synthetic, immutable fixture.

---

## 🧪 Testing & Verification

1. **Automated API Contract Tests (`npm test`)**:
   - Uses Node.js's built-in test runner (`node:test`, `node:assert/strict`) with zero external test dependencies.
   - Verifies the live `/meta` endpoint returns read-only status and valid facet arrays.
   - Validates combined query parameter filtering (`status`, `site`, `q`) against the live service.

2. **Production Build Validation (`npm run build`)**:
   - Tested Vite bundling to ensure zero TypeScript/JSX warnings or missing modules.
   - Verified that tree shaking and asset minification succeed cleanly.

3. **End-to-End Browser & Responsive Validation**:
   - Verified stat card synchronization against API summary object.
   - Tested real-time search typing, debounce behavior, filter dropdowns, and clear-filter resets.
   - Verified edge cases: zero matching results (empty state), network retry button, and pagination bounds (first/prev/next/last).
   - Inspected browser developer tools: 0 console errors, 0 runtime warnings, 100% clean DOM execution.

---

## 🌐 Deployment Instructions

This app is ready to deploy on any static hosting platform:

### Deploying to Vercel
1. Push this repository to your GitHub account.
2. In the Vercel Dashboard, click **Add New Project** and import the repository.
3. Framework Preset: **Vite** (Root Directory: `./sales-order-monitor`).
4. Click **Deploy**. Vercel will run `npm run build` and output the `dist` folder.
5. Copy the generated `.vercel.app` URL and update Deliverable #1 above.

### Deploying to Netlify
1. Drag and drop the `dist/` folder directly into [Netlify Drop](https://app.netlify.com/drop), or link your GitHub repository.
2. Build command: `npm run build`; Publish directory: `dist`.

---

## ⚠️ Notes & Limitations

- **Read-Only Data**: The mock API strictly accepts `GET` and `OPTIONS` requests; creating, modifying, or deleting orders is intentionally unsupported by the backend.
- **Global vs. Filtered Summary**: The API's `summary` object provides global dataset totals (1,200 orders, RM 998,244.30). The UI displays these global totals in the top dashboard and displays the active `filtered_orders` count in the list heading when filters are active.
- **Single Order Drill-down**: The backend provides `GET /api/mock/sales-orders/{salesId}`. The current implementation surfaces all primary operational attributes directly within the list and mobile cards; a slide-over details drawer can be added as a future iteration.
