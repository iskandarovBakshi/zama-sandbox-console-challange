# Sandbox Console

Sandbox Challenge.

## Deployed Demo

[https://zama-sandbox-console-challange.vercel.app/](https://zama-sandbox-console-challange.vercel.app/)

## Development Setup

### Prerequisites

- Node.js 18+
- pnpm (recommended)

### Getting Started

1. Clone the repository
2. Install dependencies:
    ```bash
    pnpm install
    ```
3. Start the development server:
    ```bash
    pnpm dev
    ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Run Tests

- `pnpm test` - Run Playwright E2E tests in terminal and CI
- `pnpm test:ui` - Run tests with Playwright UI
- `pnpm test:unit` - Run tests with Playwright UI

## Running tests on CI

- To run tests on CI make sure to add `PLAYWRIGHT_BASEURL` in `.env`

## Authentication

- Option B(Session Cookie based authorization) is the best, because I can check user credentials on the Server, for testing just enter any username or password
- Any `username`, `password` combination lets you in.

You can set token expiration in seconds via `NEXT_PUBLIC_TOKEN_DURATION`

## Feature Toggle

- Feature toggle, “Advanced Mode”, applies only to the Usage page to display more in depth metrics. In a more developed version of this app it can be used to activate automated actions like revoke/regenerate keys based on unusual activity.

## Architecture & Decisions

- NextJS framework for routeing and ssr: it has great and intuitive api, and very robust for scalability.
- React context for state management: it's built in, simple to use, but for bigger and scalable projects I would go with Zustand.
- MUI for component library: it's highly customizable and battle tested lib.
- pure CSS with CSS modules and PostCSS: Modern CSS is more powerfull, I enjoy writing pure CSS as much as possible.
- For mock requests I could've go with tanstack query or axios but in order to show TS/JS skills I wrote my own query mechanism with interception.

## Testing Approach

- Vitest: for unit tests
- Playwright: for e2e tests, Vitest also supports e2e but Playwright is more specific here

### If I had more time:

- Build a more helpful Dashboard for the user to see and react to information that has imminent effects.
- Consider notifications to keep a record of issues, unusual activity, etc.
- improve developer experience with more strict coding conventions, error handling.
- use react devtools profiler, performance monitoring to get rid of unnecessary renders.
- render as much as possible on the server.

### AI coding assistance:

- I use claude/chatgpt to speed up my workflow, it helps me write algorithms, documenting the code, reference Typescript syntax, edge cases with e2e tests, ideation for tests, refactoring etc.

**Time estimate:** Approximately 8 hours.
