import "dotenv/config";

type EnvType = {
  PORT: number;
}

export const ENV: EnvType = {
  PORT: parseInt(process.env.PORT as string),
}
