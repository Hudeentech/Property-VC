# Property Value Calculator (Property VC)

Estimate your property's **Capital Value** and **Rental Value** in one place. Built with React 19, TypeScript, Tailwind CSS v4, and Vite.

## Features

- **Home Hub**: Responsive desktop & mobile bento launcher with quick access to Capital Value, Rental Value, Theme toggle, and Valuation History.
- **Rental Value Calculator**: Dedicated calculator for annual gross rent, outgoings, net rental income, Years' Purchase (YP) multiplier, and capitalized value.
- **Capital Value Calculator**: Dedicated Depreciated Replacement Cost (DRC) calculator with customizable construction variables (GFA, unit rate, contingency, professional fees, depreciation) and land valuation blocks.
- **Valuation History**: Save, inspect, reload, or clear saved valuation snapshots in local storage.
- **Settings & Themes**: Switch between Light and Dark modes, customize currency symbols (`₦`, `$`, `£`, `€`, `GH₵`, `KSh`, `R`), and load sample property presets.
- **Printable Valuation Report**: Generate a clean summary report ready for printing or saving as PDF.

## Deploying to Vercel (via GitHub)

This repository is pre-configured for one-click deployment on **Vercel** via `vercel.json`:

1. Export or push this project to a **GitHub** repository.
2. Go to [vercel.com/new](https://vercel.com/new) and **Import** your GitHub repository.
3. Vercel will automatically detect the settings from `vercel.json`:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy** (no environment variables are required).

## Local Development

```bash
# Install dependencies
npm install

# Start development server on http://localhost:3000
npm run dev

# Run unit tests
npm test

# Type-check & build for production
npm run lint
npm run build
```
