import {defineConfig} from "drizzle-kit";
import { ENV } from "./src/config/env";

export default defineConfig({
    dialect: 'postgresql',
    schema: './src/database/schema.ts',
    out: './src/database/migrations',
    dbCredentials: {
        url: ENV.DATABASE_URL
    }
});
