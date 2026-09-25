# Argent Bank

A responsive banking web app built with **React**, **TypeScript**, **Redux Toolkit** and **Vite**.
It covers the Phase 1 user-authentication features: browsing the home page, signing in,
signing out, and viewing / editing your own profile (persisted to the API).

The Phase 2 **Transactions API** is delivered as a design proposal, not code — see
[`swagger-transactions.yaml`](./swagger-transactions.yaml).

---

## Prerequisites

You need **two things running**: this front end, and the Argent Bank **back-end API** it talks to.

| Tool                           | Version   | Notes                                                               |
| ----------------------------   | -------   | ------------------------------------------------------------------- |
| [Bun](https://bun.sh)          | ≥ 1.0     | Package manager & script runner used here (do**not** use npm)       |
| [Node.js](https://nodejs.org)  | ≥ 20      | Required by Vite 8                                                  |
| Back-end API                   | —         | The Argent Bank API, running on**`http://localhost:3001`**          |
| MongoDB                        | ≥ 4       | Required by the back-end API                                        |

> The back end is a **separate project** (the Argent Bank / Bank-API server provided by
> OpenClassrooms). It exposes the `/user/*` endpoints this app consumes and must be running
> before you sign in. Start it and seed its database following that project's own README —
> typically it listens on port `3001` and provides two demo accounts.

---

## Getting started

### 1. Start the back-end API

Clone and run the Argent Bank back-end in a separate folder (see its README for details):

```bash
# in the back-end project
npm install
npm run dev:server   # serves the API on http://localhost:3001 (MongoDB must be running)
npm run populate-db  # seeds the two demo users (run once, with the server running)
```

Once seeded, you can sign in with the demo credentials the back end provides:

| Email | Password |
| -------------------- | --------------- |
| `tony@stark.com` | `password123` |
| `steve@rogers.com` | `password456` |

### 2. Configure this front end

```bash
# in this project
cp .env.example .env
```

`.env` points the app at the API. The default already matches a local back end:

```dotenv
VITE_API_URL=http://localhost:3001/api/v1
```

Change it only if your API runs on a different host or port.

### 3. Install & run

```bash
bun install   # install dependencies
bun run dev   # start the dev server (Vite prints the local URL, e.g. http://localhost:5173)
```

Open the printed URL in your browser. Signing in with a demo account above (at `/login`) should
take you to your profile page (`/profile`).

### Troubleshooting the back end

These are the usual culprits behind the setup issues reported on the upstream Bank-API repo:

| Symptom                                                        | Fix                                                                                                                                                                                                          |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `npm run dev` does nothing / "missing script"                | The script is`npm run dev:server`.                                                                                                                                                                         |
| `populate-db` fails with `ECONNREFUSED 127.0.0.1:3001`     | The API server isn't running. Start it first, in another terminal.                                                                                                                                           |
| Server can't connect to MongoDB                                | Start MongoDB (e.g.`brew services start mongodb-community`). On recent Node versions, `localhost` may resolve to IPv6: set `DATABASE_URL=mongodb://127.0.0.1/argentBankDB` in the back end's `.env`. |
| Install / runtime errors in the back end                       | It targets**Node 12** (mongoose 5, bcrypt 5). Use `nvm use 12` in the back-end folder.                                                                                                               |
| `401` when testing `/user/profile` in the API's Swagger UI | Enter`Bearer <token>` **without quotes** in the Authorization field.                                                                                                                                 |

---

## Available scripts

| Command             | What it does                                                           |
| ------------------- | ---------------------------------------------------------------------- |
| `bun run dev`       | Start the Vite dev server with hot-module reload                       |
| `bun run build`     | Type-check (`tsc -b`) and build the production bundle into `dist/`     |
| `bun run preview`   | Serve the built`dist/` locally to preview the production build         |
| `bun run lint`      | Run ESLint over the project                                            |

---

## Project structure

```
src/
├── api/                # API client, typed endpoint wrappers, shared types
│   ├── client.ts       # fetch wrapper: auth header + { status, message, body } envelope
│   ├── user.ts         # signup / login / getProfile / updateProfile
│   └── types.ts        # request & response shapes
├── features/auth/      # Redux auth slice + JWT persistence
│   ├── authSlice.ts    # login / fetchProfile / updateProfile thunks, logout, selectors
│   └── tokenStorage.ts # remember-me: localStorage vs sessionStorage
├── components/
│   ├── Layout.tsx      # nav (sign-in / user / sign-out) + footer
│   └── ProtectedRoute.tsx  # gates /user behind authentication
├── pages/              # Home (/), SignIn (/login), User (/profile)
├── store/              # Redux store + typed hooks
└── App.tsx             # routes + session restore on refresh
```

---

## How authentication works

1. **Sign in** — `POST /user/login` returns a JWT. The token is stored in `localStorage`
   ("Remember me" checked) or `sessionStorage`, and the profile is fetched with
   `POST /user/profile`.
2. **Session restore** — on refresh, a stored token triggers a profile fetch so you stay
   signed in; an invalid/expired token is cleared automatically.
3. **Protected profile** — `/profile` is only reachable when authenticated; otherwise you're
   redirected to `/login`.
4. **Edit profile** — the profile page updates your first/last name via `PUT /user/profile`,
   persisting the change to the database.
5. **Sign out** — clears the token and returns to the home page.

---

## Phase 2 — Transactions API proposal

The transactions feature is specified, not implemented. The proposed endpoints (methods, routes,
parameters, and response codes) follow Swagger 2.0 in
[`swagger-transactions.yaml`](./swagger-transactions.yaml).

To view or validate it, paste the file into the [Swagger Editor](https://editor.swagger.io).

---

## Tech stack

React 19 · TypeScript · Redux Toolkit · React Router · Vite 8 · Tailwind CSS
