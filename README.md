# Security System Bundle Builder

Build a home security system step by step and watch the summary, savings and total update as you go.

This is my implementation of the Figma design that came with the task. Four steps on the left, a live review panel on the right, and one piece of state behind both.

Built with React, TypeScript and Vite. No UI kit, no state library.

## Getting started

You'll need Node 18 or newer.

```bash
git clone https://github.com/TonyNagy44/security-system-bundle-builder.git
cd security-system-bundle-builder
npm install
npm run dev
```

Then open http://localhost:5173.

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Typecheck and production build |
| `npm run preview` | Serve the production build |
| `npm run api` | Optional catalog API on port 8787 |

## What it does

**Four step accordion.** Cameras, plan, sensors, extra protection. Step 1 is open when the page loads, and each step has a button that opens the next one.

**Quantities per variant.** Black and White of the same camera are counted separately. The stepper on the card follows whichever colour is selected, so if you add 2 White and then switch to Black the stepper shows 0, and the 2 White are still sitting in the review panel on the right.

**Steppers stay in sync.** The one on the card and the one on the review line are the same component reading the same value, so changing either one updates everything.

**Live totals.** Line prices, the crossed out total and the savings line all recalculate whenever a quantity changes.

**Save and restore.** Save your system, close the tab, come back later and it's still there.

**Responsive.** Works from 390px up, following the three frames in the design.

## Project structure

```text
src/
├── data/catalog.json      products, variants, prices, steps, starting state
├── types.ts
├── state/
│   ├── builderReducer.ts  all the updates
│   ├── selectors.ts       review lines, counts, totals
│   ├── persistence.ts     localStorage read and write
│   └── BuilderProvider.tsx
└── components/            ProductCard, VariantSelector, QuantityStepper,
                           Price, BuilderStep, ReviewPanel

server/index.mjs           optional catalog API, no dependencies
```

### How the state works

The whole thing is a reducer over three fields:

```ts
{ quantities, activeVariants, openStepId }
```

Everything else is calculated from those. The "N selected" counters, the highlighted card borders, the review panel, the total, the savings line, all of it lives in `selectors.ts`. Nothing gets copied into component state, which is the reason the card steppers and the review steppers never drift apart. There is no syncing code because there is nothing to sync.

### Quantities are keyed by `productId:variantId`

This is the decision that made the variant requirement easy. Each colour has its own entry, so selecting Black shows Black's count and leaves White alone, and the review panel just lists every key with a count above zero.

Products that have no colours still get one variant, with `label: null`. That way there is no "has variants or not" branch in the components. The doorbell shows no colour selector simply because its single variant has no label.

### Nothing is hardcoded

No product name appears in any component. To add a camera you add an object to `catalog.json` and the card, the review line, the counter and the total all pick it up.

## Decisions I had to make

A few things in the design needed a call from me. Here they are.

### The prices in the mock don't add up

Wyze Cam Pan v3 shows `$39.98 → $34.98` on the card, but its review line at quantity 2 shows `$57.98 → $47.98`. Neither one is double the other. Every other product in the design multiplies correctly.

The total has to be calculated from unit prices, so I had to choose. I treated the unit price as the real one and set Pan v3 to `$28.99 → $23.99`. That keeps six numbers from the design correct (both Pan v3 review prices, `$238.81`, `$187.89` and the `$50.92` savings line) and only changes one, the price on the card. Going the other way would have broken the review line, the total and the savings message all at once.

If you prefer the other reading, it's two values in `catalog.json` and nothing else changes.

### Shipping shows a discount but isn't counted

`$238.81` is the sum of the item compare prices without the crossed out `$5.99` shipping. Adding shipping in would make it `$244.80`. So shipping renders as a row and contributes nothing to the totals. It's a flag in the data (`shipping.includeInTotals: false`) rather than a special case in the code.

### The monthly plan price is part of the total

`$9.99/mo` is included in `$187.89` in the design. Putting a monthly charge into a one time total is a bit odd in real life, but that's what the design does, so I matched it instead of fixing it on my own.

### Steps 2 to 4 had no design

Only step 1 is open in the frames I was given. I filled the other steps with the items the review panel already implies (Cam Unlimited, Sense Hub, Motion Sensor, MicroSD card) plus two extra plan options, all using the same card component. I didn't invent products I had no images for.

The plan step is marked `selection: "single"` in the data, so picking one clears the others, and plan cards show a Select button instead of a stepper. Buying three subscriptions doesn't make sense.

### "N selected" counts products, not variants

That's how the task describes it, and it matches every count in all three frames. Two colours of one camera still counts as one. If you want it counting variants instead, it's one line in `stepSelectedCount`.

### The counter shows up differently per breakpoint

In the mobile frame the count appears on collapsed steps. On tablet and desktop the collapsed steps only show a chevron. I followed both. The chevron directions in the mobile frame don't match the open and closed states, so I treated that as a mock detail and bound them to the real state.

### Saving is a deliberate action

Nothing saves automatically. Clicking **Save my system for later** writes to localStorage under a versioned key, and on load a saved system takes priority over the default one.

What comes back gets checked first. Unknown product or variant IDs, quantities that aren't numbers and step IDs that no longer exist are dropped, so changing the catalog later can't bring back a deleted product or leave the app in a state it can't render. The write is wrapped in a try/catch too, so private browsing gives you a message instead of a broken page.

## Fonts

The design uses Gilroy Medium and Gilroy SemiBold. Gilroy is a licensed font so I haven't committed it. Drop the files here and the `@font-face` rules will pick them up:

```text
public/fonts/
├── Gilroy-Medium.woff2
└── Gilroy-SemiBold.woff2
```

Without them it falls back to Poppins, which is close enough in proportions that the layout doesn't shift.

## Assets

The images in `public/assets/` came out of the exported design frames. The camera photos are fine. The sensor, hub and MicroSD thumbnails are low resolution because that's the size they appear at in the source. Real exports drop straight in with the same filenames.

The tiny colour thumbnails inside the chips are about 11px in the frames, too small to pull out, so `VariantSelector` reuses the product photo with a CSS filter per colour. Swap in proper images and the markup stays the same.

## Optional catalog API

By default the app imports the bundled JSON. To serve the same data from a local API:

```bash
npm run api                                        # terminal 1
VITE_API_URL=http://localhost:8787 npm run dev     # terminal 2
```

`server/index.mjs` has no dependencies. If the API is configured but not running, the app falls back to the bundled catalog and tells you, rather than showing an empty page.

## Accessibility

- Accordion headers are real buttons with `aria-expanded` and `aria-controls`
- Colour chips work as a radio group
- Quantity buttons have labels per item and announce changes with `aria-live`
- Keyboard focus is visible everywhere
- `prefers-reduced-motion` is respected

`npm run build` passes with TypeScript strict mode and `noUnusedLocals` on.

## A note on how I worked

I used an AI assistant while building this, mostly for scaffolding, repetitive CSS and a first draft of these docs, and to think out loud while I was working through the pricing problem in the design.

The architecture, the data model and the calls above are mine, and I read and adjusted everything before it went in. I also checked the behaviour in the browser instead of assuming it worked. Happy to walk through any part of the code.

## What I'd do next

**Tests.** I checked the important behaviour by hand in the browser (variant counts staying separate, steppers syncing both ways, the counter, save and restore, the locked hub stepper) but didn't set up a test runner. Vitest over the reducer and selectors would be first, since they're pure functions and the totals are where a bug would actually cost money. Then one end to end test for the variant flow.

**Empty state.** The review panel handles having nothing in it, but the design doesn't show that case, so the wording is mine.

**Motion.** The accordion opens and closes with no height animation. Nothing in the design pointed either way and I'd rather leave it out than invent something.

**Better assets** for the sensor and accessory thumbnails, and a real backend behind the API that's already there.

Built as a frontend take home based on the provided design.
