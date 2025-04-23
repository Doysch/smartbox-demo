# Smartbox Demo

This project demonstrates a multilingual ecommerce search experience using Algolia.

It includes:
- A React InstantSearch frontend (with category pages, PDPs, autocomplete, and recommendations)
- A set of scripts to transform and enrich product data (boxes and experiences)
- Simulated search and events to showcase DRR and analytics

## Data

The `/data` folder (not committed) contains Smartbox CSVs and enriched JSON output for indexing.

## Scripts

All transformation and indexing logic lives in `/scripts`. API keys are referenced via environment variables.

## Frontend

The SPA is built with React + Vite and deployed via GitHub Pages:  
🔗 [https://doysch.github.io/smartbox-demo/](https://doysch.github.io/smartbox-demo/)

## Notes

- This is a demo — no real customer data is exposed.