import { env } from "@/src/env";
import type { NextFunction, Request, Response } from "express";

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }
    if (error && typeof error === "object" && "message" in error) {
        return String(error.message);
    }
    if (typeof error === "string") {
        return error;
    }
    return "An unknown error occurred.";
}

export default function errorHandler(
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (res.headersSent || env.DEBUG) {
        next(error);
        return;
    }

    res.status(500).json({
        error: {
            message: getErrorMessage(error) || "An error occurred. Please view logs for more details"
        }
    })
}