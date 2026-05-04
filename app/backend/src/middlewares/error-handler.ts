import { env } from "@/env";
import CustomError from "@/errors/CustomError";
import type { NextFunction, Request, Response } from "express";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "message" in error)
    return String(error.message);
  if (typeof error === "string") return error;
  return "An unknown error occurred.";
}

export default function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.headersSent) {
    next(error);
    return;
  }
  if (env.NODE_ENV === "debug") {
    console.error(error);
  }

  if (env.NODE_ENV === "development") {
    console.clear();
    console.log(error);
  }

  if (error instanceof CustomError) {
    res.status(error.statusCode).json({
      success: false,
      error: {
        message: error.message,
        code: error.code,
      },
    });
    return;
  }

  res.status(500).json({
    success: false,
    error: {
      message: getErrorMessage(error),
      ...(env.NODE_ENV === "debug" && {
        stack: error instanceof Error ? error.stack : undefined,
      }),
    },
  });
}
