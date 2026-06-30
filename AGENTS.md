# AGENTS

This repository is a multilingual Next.js travel booking web app.
It is built with the App Router, TypeScript, Tailwind CSS, Radix UI primitives, React Query, and i18next.

## Key facts
- App Router root is `src/app/[lang]`, with supported locales `en`, `fr`, and `de`.
- Uses `@/*` path alias to resolve `src/*` from `tsconfig.json`.
- The site fetches data from a Strapi backend and has several server API routes under `src/app/api`.
- Translations are stored in `src/i18n/locales/*.json` and loaded by `src/lib/i18n.ts`.
- `next.config.ts` contains allowed remote image hosts, including Strapi and Resend-related sources.

## Recommended entry points for agents
- `README.md` – setup and feature summary
- `package.json` – scripts and dependencies
- `tsconfig.json` – compiler and alias config
- `next.config.ts` – Next.js runtime settings
- `src/app/[lang]/layout.tsx` – locale-aware root layout
- `src/lib/api.ts` – Strapi data fetching, image URL handling, locale fallback logic
- `src/app/api` – serverless API routes for contact, enquiries, subscribe, itinerary, PayPal, and GraphQL proxy
- `src/config` – feature flags and i18n config
- `src/i18n/locales` – locale dictionaries

## Build and validation commands
- `npm install` or `yarn install` or `pnpm install`
- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`

## Environment variables to be aware of
- `NEXT_PUBLIC_STRAPI_URL`
- `STRAPI_TOKEN`
- `RESEND_API_KEY`
- `ADMIN_EMAIL`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_WP_GRAPHQL_URL`
- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_BACKEND_SECRET_TOKEN`

## Notes for AI agents
- Keep changes minimal and prefer linking to existing docs rather than duplicating them.
- When editing content or translations, preserve locale JSON structure and the fallback behavior to English.
- Avoid assuming a test suite exists; the repo currently has no dedicated test configuration.
- Use `next lint` and `next build` to validate changes where appropriate.
