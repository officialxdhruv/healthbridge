import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { env } from "@/env";
import errorHandler from "@/middlewares/error-handler";
import v1 from "@/routes/v1/routes";

export const createServer = () => {
  const app = express();

  app
    .disable("x-powered-by")
    .use(express.json())
    .use(cookieParser())
    .use(express.urlencoded({ extended: true }))
    .use(
      cors({
        origin: [env.FRONTEND_URL, env.ADMIN_URL],
        credentials: true,
      }),
    );

  app.use("/api/v1", v1);

  app.get("/health", (_req, res) => {
    res.status(200).json({ ok: true, environment: env.NODE_ENV });
  });

  // 404 handler
  app.use((_req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
  });

  // Error handler
  app.use(errorHandler);

  return app;
};
