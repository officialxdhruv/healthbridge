import { ForbiddenError, UnauthorizedError } from "@/errors";
import { env } from "@/env";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

async function authAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token;

  if (!token) {
    throw new UnauthorizedError("No token provided");
  }

  const decoded = jwt.verify(token, env.JWT_SECRET) as unknown as {
    email: string;
    role: string;
  };

  if (decoded.role !== "admin" || decoded.email !== env.ADMIN_EMAIL) {
    throw new ForbiddenError("Not authorized");
  }

  req.admin = { email: decoded.email, role: decoded.role };

  next();
}

export default authAdmin;
