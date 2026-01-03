import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // TODO:
  //   ssl: {
  //     rejectUnauthorized: false
  //   }
});

export default pool;
