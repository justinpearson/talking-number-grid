# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A simple educational web app that displays a 10x10 grid of numbers (1-100). Clicking any number speaks it aloud using the Web Speech API. Designed for teaching kids to recognize numbers.

## Development

This is a static website with no build step or package manager. To develop locally:

```bash
# Start a local server (any of these work)
python3 -m http.server 8000
# or
npx serve .
```

Then open http://localhost:8000 in a browser.

## Architecture

Three files make up the entire app:
- `index.html` - Page structure with a container div for the grid
- `script.js` - Creates 100 number buttons on DOMContentLoaded; uses `SpeechSynthesisUtterance` to speak numbers
- `styles.css` - CSS Grid layout (10 columns), gradient backgrounds cycling through 10 colors via `:nth-child(10n+X)` selectors

## Deployment

Pushes to `main` trigger automatic deployment to GitHub Pages via `.github/workflows/deploy.yml`. The workflow uploads the entire repo as a static site artifact.
