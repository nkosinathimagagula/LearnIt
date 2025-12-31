import "dotenv/config";

type EnvType = {
  SERVER_PORT: number;

  DATABASE_URL: string;
}

export const ENV: EnvType = {
  SERVER_PORT: parseInt(process.env.SERVER_PORT as string),
  DATABASE_URL: process.env.DATABASE_URL as string,
}
