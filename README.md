# Security System Bundle Builder

A responsive security system bundle builder based on the provided Figma design.

The app lets users build their system step by step, choose product variants and quantities, and see the selected items, pricing, savings, and total update instantly in the review panel.

Built with **React, TypeScript, and Vite**, with a lightweight state setup and no UI framework or state management library.

---

## Features

- Multi-step security system builder
- Product variants and quantity selection
- Live order summary and pricing
- Automatic savings calculation
- Responsive layout for mobile, tablet, and desktop
- Save and restore the current configuration
- Local storage persistence
- Keyboard-friendly controls and accessible interactions
- Data-driven product catalog
- Optional API for serving the product catalog

---

## Tech Stack

- **React**
- **TypeScript**
- **Vite**
- **CSS**
- **LocalStorage**
- **Node.js** — optional catalog API

No external UI library or state management package is required.

---

## Getting Started

### Requirements

- Node.js 18+
- npm

### Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/TonyNagy44/security-system-bundle-builder.git
cd security-system-bundle-builder
npm install
```

### Run locally

```bash
npm run dev
```

The app will be available at:

```text
http://localhost:5173
```

---

## Available Scripts

### Development

```bash
npm run dev
```

Starts the Vite development server.

### Production build

```bash
npm run build
```

Runs the TypeScript checks and creates the production build.

### Preview production build

```bash
npm run preview
```

Serves the production build locally.

### Optional API

```bash
npm run api
```

Starts the local catalog API on:

```text
http://localhost:8787
```

---

## 📁 Project Structure

```text
src/
├── components/
│   ├── ProductCard
│   ├── VariantSelector
│   ├── QuantityStepper
│   ├── Price
│   ├── BuilderStep
│   └── ReviewPanel
│
├── state/
│   ├── builderReducer.ts
│   ├── selectors.ts
│   ├── persistence.ts
│   └── BuilderProvider.tsx
│
├── data/
│   └── catalog.json
│
├── types.ts
└── ...

server/
└── index.mjs
```

### Architecture

The application keeps the builder state in one place using a reducer.

The main state contains:

- `quantities`
- `activeVariants`
- `openStepId`

Everything else, including selected item counts, totals, savings, and the review panel, is calculated from that state.

This keeps the product cards and review panel in sync without maintaining duplicate state.

The product catalog is also data-driven. Products, variants, prices, and steps live in `catalog.json`, so adding or changing a product does not require changes inside the UI components.

---

## Save & Restore

The **Save my system for later** action stores the current configuration in `localStorage`.

When the application starts, it checks for a previously saved configuration and restores it when available.

Saved data is validated before being used, so outdated or invalid product and variant IDs don't break the application.

---

## Fonts

The original design uses **Gilroy Medium** and **Gilroy SemiBold**.

Because Gilroy is a licensed font, it isn't included in the repository.

If you have the font files, place them here:

```text
public/fonts/
├── Gilroy-Medium.woff2
└── Gilroy-SemiBold.woff2
```

The existing `@font-face` definitions will pick them up automatically.

Without Gilroy, the project falls back to Poppins.

---

## Assets

The images in `public/assets/` were taken from the provided design frames.

---

## Optional Catalog API

The project can run either with the bundled catalog or with the optional local API.

Start the API:

```bash
npm run api
```

Then run the application with:

```bash
VITE_API_URL=http://localhost:8787 npm run dev
```

If the API isn't configured, the application uses the local `catalog.json`.

If the API is configured but unavailable, the application falls back to the bundled catalog instead of leaving the UI empty.

---

## Responsive Design

The layout adapts across the main breakpoints:

- **Mobile:** stacked content and review sections
- **Tablet:** single-column layout with the review panel below
- **Desktop:** two-column layout with a sticky review panel

The UI remains usable between the main breakpoints rather than only targeting the exact design sizes.

---

## Accessibility

A few accessibility details are built into the UI:

- Semantic buttons for accordion controls
- `aria-expanded` and `aria-controls`
- Accessible variant selection
- Labels for quantity controls
- Live announcements for quantity changes
- Visible keyboard focus
- `prefers-reduced-motion` support

---

## Implementation Notes

A few details in the provided design required interpretation during implementation.

### Pricing

Some of the prices shown in the design don't fully line up mathematically. The implementation uses the values that produce the correct review totals and savings shown in the design.

The Pan v3 pricing can be adjusted directly in:

```text
src/data/catalog.json
```

No component changes are required.

### Shipping

Shipping is displayed in the review panel but does not contribute to the item totals. This is controlled through the catalog data rather than a hardcoded exception.

### Subscription plan

The monthly plan price is included in the displayed total because that is how it appears in the provided design.

### Product selection

The `N selected` counter represents distinct products rather than individual variants. Selecting two colours of the same product still counts as one selected product.

---

## Possible Improvements

If this were going into a larger production application, the next improvements I'd consider would be:

- Add unit tests for the reducer and selectors
- Add end-to-end tests for the main bundle-building flow
- Add higher-resolution product and variant assets
- Add richer empty-state designs
- Add subtle transitions to the accordion interactions
- Connect the catalog to a real backend service

---

## License

This project was created as a frontend implementation based on the provided design.
