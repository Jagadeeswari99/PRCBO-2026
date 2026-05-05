
# Resume Analyzer (React)

## Overview
This project is a smart resume analyzer built with React. It supports:
- PDF resume upload with on-device text extraction
- Direct resume text input
- ATS score generation
- Skill suggestions and improvement guidance
- Styled, responsive UI for desktop and mobile

## AI Integration
The app uses OpenRouter AI when you provide a free API key in `.env`.
If no key is configured, the app still works with a local heuristic analysis engine.

## Setup
1. npm install
2. Copy `.env.example` to `.env`
3. Add your OpenRouter API key as `VITE_OPENROUTER_KEY` (optional)

## Run
npm run dev

## Build
npm run build

## Deploy to Netlify
1. Build the app with `npm run build`
2. Install Netlify CLI if needed:
   - `npm install -g netlify-cli`
3. Login to Netlify:
   - `netlify login`
4. Deploy the `dist` folder:
   - `cd AI-Resume`
   - `npm run deploy`

Netlify is configured via `netlify.toml` so the app publishes from `dist`.
If you use OpenRouter, add `VITE_OPENROUTER_KEY` to your Netlify site environment variables.
