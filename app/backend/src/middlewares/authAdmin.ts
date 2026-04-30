import { ForbiddenError, UnauthorizedError } from "@/errors";
import { env } from "@/env";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

async function authAdmin(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthorizedError("No token provided");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        throw new UnauthorizedError("No token provided");
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as unknown as { email: string, role: string };

    if (decoded.role !== "admin" || decoded.email !== env.ADMIN_EMAIL) {
        throw new ForbiddenError("Not authorized");
    }

    next();
}

export default authAdmin;