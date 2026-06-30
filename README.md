# Allez Moris Travel Next.js App

This is a modern, multilingual web application developed by **Filawave Ltd** for **Allez Moris Travel Ltd**. It serves as a comprehensive travel booking and itinerary platform for Mauritius ("Allez Moris").

## Features

- **Multilingual Support**: Fully internationalized routing and content using `i18next`.
- **Travel Services**: Booking for airport transfers, excursions, and a custom itinerary builder.
- **Secure Payments**: Integrated with `@paypal/react-paypal-js` for seamless checkouts.
- **Email Notifications**: Powered by `resend` for reliable transactional emails.
- **Interactive UI**: Utilizing Tailwind CSS, Radix UI primitives, React Google Maps, and robust date pickers.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 15+ (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [Radix UI](https://www.radix-ui.com/), Shadcn UI styles
- **Icons**: [Lucide React](https://lucide.dev/)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Data Fetching**: [TanStack React Query](https://tanstack.com/query/latest)

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. You can start editing the page by modifying files inside `src/app/`.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new). Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---
v0.1.3

*Developed by Filawave Ltd*
