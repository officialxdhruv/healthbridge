import { env } from "@/env";
import CustomError from "@/errors/CustomError";
import type { NextFunction, Request, Response } from "express";

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (error && typeof error === "object" && "message" in error) return String(error.message);
    if (typeof error === "string") return error;
    return "An unknown error occurred.";
}

export default function errorHandler(
    error: unknown,
    _req: Request,
    res: Response,
    next: NextFunction
) {
    if (res.headersSent) {
        next(error);
        return;
    }

    // log full error in development
    if (env.NODE_ENV === "development") {
        console.error(error);
    }

    if (error instanceof CustomError) {
        res.status(error.statusCode).json({
            success: false,
            error: {
                message: error.message,
                code: error.code,
                ...(env.NODE_ENV === "development" && { stack: error.stack }),
            }
        });
        return;
    }

    res.status(500).json({
        success: false,
        error: {
            message: getErrorMessage(error),
            ...(env.NODE_ENV === "development" && {
                stack: error instanceof Error ? error.stack : undefined
            }),
        }
    });
}