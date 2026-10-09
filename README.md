# Cliffesto

Local-first Next.js 16 storefront using Tailwind CSS v4, PostgreSQL, `pg`, and opaque HTTP-only cookie sessions.

## Development

```powershell
Copy-Item .env.example .env.local
docker compose up -d db
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Or run the complete development stack:

```powershell
docker compose up --build
```

Stop containers without deleting the persistent database volume with `docker compose stop`.

Public storefront routes work from the separated demo catalog in [lib/products.ts](./lib/products.ts). Authentication, cart, order, and payment operations use PostgreSQL when configured. Payments intentionally return a clear not-configured response rather than claiming a charge.

## Checks

```powershell
pnpm typecheck
pnpm build
pnpm lint
docker compose config
```

Required server variables are documented in [.env.example](./.env.example). Never commit `.env.local`.
