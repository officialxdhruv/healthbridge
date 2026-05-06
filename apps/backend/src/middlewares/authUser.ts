import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "@/env";
import { ForbiddenError, UnauthorizedError } from "@/errors";

async function authUser(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.["user-token"]

  if (!token) {
    throw new UnauthorizedError("No token provided");
  }

  const decoded = jwt.verify(token, env.JWT_SECRET) as unknown as {
    id: string;
    role: string;
  };

  if (decoded.role !== "user") {
    throw new ForbiddenError("Access denied");
  }

  req.user = { id: decoded.id, role: decoded.role };

  next();
}

export default authUser;
