
# Resume Analyzer (React)

## Overview
This project is a smart resume analyzer built with React. It supports:
- PDF resume upload with on-device text extraction
- Direct resume text input
- ATS score generation
- Skill suggestions and improvement guidance
- Styled, responsive UI for desktop and mobile

## AI Integration
The app uses OpenRouter AI via a Netlify serverless function to keep API keys secure.
- In production (Netlify), set `OPENROUTER_KEY` in site environment variables.
- For local development, set `VITE_OPENROUTER_KEY` in `.env`.
- If no API key is configured or the API fails, the app falls back to local heuristic analysis.

## Setup
1. npm install
2. Copy `.env.example` to `.env` (for local dev)
3. For Netlify deployment:
   - Set `OPENROUTER_KEY` in Netlify site environment variables
   - The Netlify function handles the API calls securely

## Run Locally
For full functionality including AI analysis:
1. Install Netlify CLI: `npm install -g netlify-cli`
2. Set `VITE_OPENROUTER_KEY` in `.env` with your OpenRouter API key
3. Run `netlify dev`

For basic functionality with local analysis only:
- Run `npm run dev` (Vite only, no AI analysis)

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
