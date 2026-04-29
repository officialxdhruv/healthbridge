import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
    server: {
        PORT: z.coerce.number().min(1000),
        MONGODB_URI: z.url(),
        JWT_SECRET: z.string().min(1),
        NODE_ENV: z.enum(["development", "production"]),
        FRONTEND_URL: z.url(),
    },
    runtimeEnv: process.env,
    emptyStringAsUndefined: true,
});
