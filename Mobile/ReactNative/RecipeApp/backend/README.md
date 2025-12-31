# Recipe App Backend

This is the backend for the Recipe App, built with TypeScript, Express, and PostgreSQL.

## Environment Variables

Make sure to create a `.env` file in the root of the project with the following variables:

```
SERVER_PORT=4000
DATABASE_URL=postgres://user:password@localhost:5432/recipe_app
```
##  Setting up the database (using drizzle)
1. Ensure you have PostgreSQL running on your machine.
2. Update the `DATABASE_URL` in the `.env` file with your PostgreSQL credentials.
3. Run the following command to create the necessary tables:

#### Quick way (prototyping)
```bash
pnpm drizzle:push
```
#### Recommended way (safer)
```bash
pnpm drizzle:generate
pnpm drizzle:migrate
```

## Development

To start the development server, run:

```bash
pnpm dev
```
