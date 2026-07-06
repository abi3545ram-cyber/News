# Cortex — Daily Knowledge Hub

A single-page web app: live news, a 111-question general-knowledge quiz (plus endless online mode), a vocabulary vault with flashcards, a fact library, on-this-day history, and live markets (gold, silver, BTC, ETH, GBP FX) with a 7-day Bitcoin chart. Day streaks, quiz stats and word mastery are saved in your browser.

No build step, no backend, no API keys — everything is fetched client-side from public APIs.

## Deploy on GitHub Pages

1. Create a new **public** repository on GitHub (e.g. `cortex`).
2. Upload every file in this folder (**Add file → Upload files**), keeping them at the repo root.
3. Go to **Settings → Pages**, set **Source** to *Deploy from a branch*, choose branch **main** and folder **/ (root)**, then **Save**.
4. After a minute or two your app is live at `https://<your-username>.github.io/cortex/`.

## Use it like an app on your phone

Open the URL on your phone, then **Share → Add to Home Screen** (iPhone) or **⋮ → Add to Home screen** (Android). It launches full-screen with its own icon.

## Run it locally

Just open `index.html` in any browser.

## Files

- `index.html` — the entire app (HTML + CSS + JS in one file)
- `manifest.json`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` — web-app install metadata
- `.nojekyll` — tells GitHub Pages to serve files as-is

## Data sources

BBC News and Google News RSS (via CORS proxies where needed), Open Trivia DB, Kraken (crypto), gold-api.com (metals), frankfurter.dev (FX), byabbe.se (on this day). Market data is informational only — not financial advice.
