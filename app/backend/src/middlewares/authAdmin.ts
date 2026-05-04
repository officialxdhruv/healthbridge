import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "@/env";
import { ForbiddenError, UnauthorizedError } from "@/errors";

async function authAdmin(req: Request, _res: Response, next: NextFunction) {
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
