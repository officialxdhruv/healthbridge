import { env } from '@/env'
import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { ForbiddenError, UnauthorizedError } from '@/errors';

async function authUser(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthorizedError("No token provided");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        throw new UnauthorizedError("No token provided");
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as unknown as { id: string; role: string };

    if (decoded.role !== "user") {
        throw new ForbiddenError("Access denied");
    }

    req.user = { id: decoded.id, role: decoded.role };

    next();
}

export default authUser;