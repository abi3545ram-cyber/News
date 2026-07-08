# Cortex v2 — Daily Knowledge Hub

A single-file web app packing a full daily knowledge routine. No build step, no backend, no accounts.

## Features

**Today** — greeting + day streak, live top headlines with one-tap digest, question of the day, weather (any city), word of the day with pronunciation, fun fact, quote of the day, markets at a glance, on-this-day history, latest cs.AI paper from arXiv, trending new GitHub repos, keyword flags, and a GitHub-style activity heatmap.

**News** — BBC, Guardian, Ars Technica, Google News and Hacker News across 9 sections, plus your own custom RSS feeds. Keyword highlighting, NEW badges since your last visit, already-read dimming, save-for-later list, in-app reader view, search, and AI/offline digests.

**Quiz** — 111 built-in questions (plus your own imported packs) across 6 topics with explanations, endless online mode (Open Trivia DB), daily challenge with a shareable score grid, 60-second blitz, sudden death, pass-the-phone two player, spaced-repetition review of your misses, per-category accuracy with Bronze/Silver/Gold badges.

**Words** — 60 CS/academic words with examples, spaced-repetition flashcards (Again/Good/Easy), text-to-speech pronunciation, dictionary lookup for any English word with add-to-vault, reverse quiz (definition → word), and anagram game.

**Facts** — fact of the day, 48-fact library with favourites and share-as-image, fact-or-fiction game, on-this-day events/births/deaths, XKCD of the day, and the daily Lichess chess puzzle.

**Markets** — gold, silver, BTC, ETH (with £ conversions and daily change), FTSE 100, S&P 500, GBP→USD/EUR, switchable charts (BTC 7d / ETH 7d / GBP-USD 30d), a watchlist with live £ valuation and P/L, and price alerts.

**App** — light/dark/auto theme, command palette (Ctrl/Cmd+K), keyboard shortcuts 1–6, settings panel (name, city, card visibility & order), full data export/import, service-worker offline support, installable on your phone.

## Optional AI

Paste an Anthropic API key in **Settings → AI** to enable AI digests. The key is stored only in your browser and calls Anthropic directly. Without a key, Cortex uses a built-in offline digest instead.

## Deploy on GitHub Pages

1. Create a new **public** repository (e.g. `cortex`).
2. Upload every file in this folder to the repo root (**Add file → Upload files**).
3. **Settings → Pages** → Source: *Deploy from a branch* → branch **main**, folder **/ (root)** → Save.
4. Your app is live at `https://<your-username>.github.io/cortex/` a minute later.

On your phone: open the URL → **Add to Home Screen** for a full-screen app with its own icon.

## Files

`index.html` (the whole app) · `sw.js` (offline cache) · `manifest.json` + icons (install metadata) · `.nojekyll`

## Data sources

BBC / Guardian / Ars Technica / Google News RSS, Hacker News (Algolia), Open Trivia DB, Kraken, gold-api.com, frankfurter.dev, Stooq, Open-Meteo, dictionaryapi.dev, byabbe.se, arXiv, GitHub, XKCD, Lichess. Market data is informational only — not financial advice.
