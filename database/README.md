# Local PostgreSQL

This folder contains the local PostgreSQL environment for MovieApp.

## Start the database

Create a local environment file from `.env.example`, then start PostgreSQL:

```powershell
Copy-Item .env.example .env
docker compose up -d
```

The development connection string for `server/.env` is:

```env
DATABASE_URL="postgresql://movieapp:movieapp_dev_password@127.0.0.1:5433/movieapp?schema=public"
```

## Stop the database

```powershell
docker compose down
```

Do not add `-v` unless you intentionally want to delete local database data.

## Apply Prisma migrations

From the `server` directory, install dependencies and apply existing migrations:

```powershell
npm install
npm run db:migrate
```

Useful Prisma commands:

```powershell
npm run db:validate
npm run db:generate
npm run db:studio
```

`schema.prisma` is maintained in `server/prisma/`. Create a migration whenever
you intentionally change that schema:

```powershell
npm run db:migrate -- --name describe_your_change
```
