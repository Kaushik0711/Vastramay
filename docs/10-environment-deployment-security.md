# 10 — Environment, Deployment and Security

## 1. Environment configuration

Keep a `.env.example` with placeholder names only. The actual variables depend on the selected services and must be verified against their current documentation.

Possible client-safe variables:
- `VITE_APP_NAME=Vastramay`
- `VITE_APP_URL=http://localhost:5173`
- `VITE_SUPABASE_URL=`
- `VITE_SUPABASE_ANON_KEY=`

Only use client-exposed variables for values designed to be public. Never put service-role keys, payment secret keys, webhook secrets or private API credentials in any `VITE_*` variable.

Server-side variables may include:
- Database/server credentials
- Payment provider secret
- Payment webhook secret
- Email provider credentials
- Shipping provider credentials

Exact names depend on the backend architecture.

## 2. Git and branch

The user has identified the project/website and branch name as `Vastramay`. Git branch names are case-sensitive in many workflows and teams may enforce lowercase conventions. Inspect existing branches and repository policy before renaming. Do not force-push or rename shared branches without checking the team's workflow.

Suggested safe inspection commands:

```bash
git status
git branch --show-current
git branch --list
```

If creating a new branch is appropriate and no conflicting branch exists:

```bash
git switch -c Vastramay
```

Do not run this if the branch already exists; inspect it first.

## 3. Build and deploy

Before deployment:
- Confirm Node.js version against Vite and dependency requirements.
- Install with the project's lockfile and package manager.
- Run lint, tests and production build.
- Configure production environment variables in the deployment provider.
- Configure SPA route fallback if required by the host.
- Configure domain, HTTPS and canonical URL.
- Ensure private API routes/functions are deployed and secured.
- Test payment webhooks against the correct production endpoint.
- Verify image/CDN access and caching.
- Verify robots/sitemap behaviour.
- Test a real low-value purchase only when the merchant/provider setup is approved and safe.

## 4. Security essentials

- Never trust client-provided prices or totals.
- Verify payments server-side.
- Use idempotency for payment/order operations.
- Protect private customer and admin data.
- Apply authorization at the backend, not just in React routes.
- Validate inputs server-side.
- Rate-limit sensitive endpoints as appropriate.
- Avoid exposing internal error details.
- Use secure guest order access.
- Do not log secrets or payment-sensitive data.
- Review dependencies and third-party licences.
- Define data retention and privacy practices for the actual business.

## 5. Production status

A local UI build is not the same as a production-ready store. Mark payment, shipping, notifications, inventory, authentication and admin operations as production-ready only after their configured services and security controls have been tested.
