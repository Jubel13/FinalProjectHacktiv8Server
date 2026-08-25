# Copilot instructions for AutoClassic server

This file guides Copilot sessions for the repository. It focuses on concrete commands, architecture, and repository-specific conventions.

---

## Quick commands (build / run / test)

- Install deps: `npm install`
- Start server (production-style): `npm start` (uses `node ./bin/www`, PORT via env)
- Start server (dev): `npm run dev` (nodemon)
- Run full test suite: `npm test` (runs jest with project defaults: --detectOpenHandles --forceExit --runInBand --silent --coverage)

Run a single test file (reuses package.json test flags):
- `npm test -- __test__/buyer.test.js`

Run a single test by name (regex):
- `npm test -- -t "should return response (201)"`

Directly with jest (skip npm wrapper):
- `npx jest __test__/buyer.test.js`

Notes:
- Tests run with Jest + Supertest and expect a PostgreSQL test database (see `config/config.json`). Jest sets `NODE_ENV=test` automatically.
- See `jest.config.js` for testTimeout (5000ms).

---

## Required environment variables

Put secrets/keys in a `.env` file (not checked in). The code reads env vars via `dotenv` in `app.js`.

Common environment variables used in this repo:
- SECRET_KEY — JWT signing key
- PORT — server port (optional; defaults to 3000)
- CLIENT_KEY, AUTHORIZATION — Midtrans client/server keys
- IMAGE_KIT_URL, IMAGE_KIT_PUBLIC, IMAGE_KIT_PRIVATE — ImageKit config used by image auth controller
- MAIL_USERNAME, MAIL_PASSWORD, OAUTH_CLIENTID, OAUTH_CLIENT_SECRET, OAUTH_REFRESH_TOKEN — Gmail/OAuth for nodemailer
- DATABASE_URL — optional (production) Postgres connection string (models use this when `use_env_variable` is set in config)

Database config (default): `config/config.json` defines:
- development: classic_cars_db (postgres/postgres)
- test: classic_cars_test (postgres/postgres)

Create the DBs or point `DATABASE_URL` to a Postgres instance before running tests or server.

---

## High-level architecture

- app.js: Express app setup (parsing, CORS, router) and central error handler middleware.
- bin/www: process entry that starts the HTTP server.
- routes/: route modules; `routes/index.js` mounts the major route groups (cars, buyers, dealers, admins, inspections, brands, types, payments, auth/imagekit).
- controllers/: request handlers for each resource. Controllers usually `try/catch` and call `next(err)` on failure.
- models/: Sequelize models; `models/index.js` instantiates Sequelize using `config/config.json` and NODE_ENV.
- API/: Midtrans client wrappers (snap/core) used by payment controllers.
- helpers/: small utility wrappers (bcrypt, jwt, nodemailer) used across controllers.
- middlewares/: auth (admin/buyer), general authentication and `errorHandlers.js` which maps thrown error objects to HTTP responses.
- migrations/ and seeders/ included (Sequelize-style) — not wired to npm scripts here.
- __test__/: Jest + Supertest integration tests that exercise routes/controllers against the DB.
- api-doc.md: endpoint list and example request/responses.

---

## Key repository conventions

- Error throwing pattern: controllers throw plain objects shaped like `{ name: "UNAUTHORIZED" | "NOT_FOUND" | "BAD_REQUEST" | "MidtransError" | ..., code: <http code>, message: "..." }`. The `middlewares/errorHandlers.js` file inspects `err.name` and `err.code` to choose status and payload. Follow this pattern for consistency.

- Auth/helpers:
  - JWT: use `helpers/jwt.js` (`SECRET_KEY` required). `generateToken(payload)` and `generatePayload(token)` are the helpers.
  - Passwords: use `helpers/bcrypt.js` (`hashPassword`, `comparePassword`) rather than calling bcrypt directly in controllers.

- Tests:
  - Tests rely on the test DB defined in `config/config.json` and commonly use `queryInterface.bulkDelete`/`bulkInsert` to set up/tear down data. Preserve the same test DB name or adjust `NODE_ENV=test` config.
  - Some tests mock `helpers/nodemailer` behavior — avoid changing the transporter shape without updating mocks.

- Sequelize instantiation: `models/index.js` respects `config.use_env_variable` if present (production). When present it reads the env var name from config (e.g., `DATABASE_URL`). For development/test, config.json credentials are used directly.

- Payment and external APIs:
  - Midtrans clients are in `API/` and expect `CLIENT_KEY` and `AUTHORIZATION` env vars.
  - ImageKit auth endpoint is implemented at `controllers/imagekitAuthController.js` and expects IMAGE_KIT_* env vars.

- Logging and errors: controllers generally `next(err)` rather than sending error responses directly. Centralized error handler will produce JSON responses.

---

## Important files to consult quickly

- `readme.md` — project overview and tech stack
- `api-doc.md` — endpoint reference and example payloads
- `config/config.json` — Sequelize DB configuration (dev/test/prod)
- `middlewares/errorHandlers.js` — canonical error-to-HTTP mapping
- `models/index.js` — how Sequelize picks up env and models

---

## Notes for Copilot sessions

- Prefer returning example commands exactly as shown above.
- When suggesting code changes that affect error semantics, update `middlewares/errorHandlers.js` accordingly.
- Before modifying tests, check `__test__` mocks (nodemailer, environment dependencies) and the DB setup in `config/config.json`.
- No dedicated linter/format script is present; do not suggest adding tooling without the author's approval.

---

File created from repository inspection. Keep this file up-to-date when adding new env vars, scripts, or CI.
