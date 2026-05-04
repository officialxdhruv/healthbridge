import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    PORT: z.coerce.number().min(1000).default(3000),
    MONGODB_URI: z.string().min(1).default("mongodb://localhost:27017"),
    JWT_SECRET: z.string().min(32),
    NODE_ENV: z.enum(["development", "production", "debug"]),
    FRONTEND_URL: z.string().min(1),
    CLOUDINARY_CLOUD_NAME: z.string().min(1),
    CLOUDINARY_API_KEY: z.string().min(1),
    CLOUDINARY_API_SECRET: z.string().min(1),
    ADMIN_EMAIL: z.email(),
    ADMIN_PASSWORD: z.string().min(8),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
