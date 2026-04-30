import jwt from 'jsonwebtoken';
import type express from "express";
import { env } from '@/src/env';

// Doctor authentication middleware
async function authDoctor(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) {
    try {
        // Check for token in Authorization header
        const authHeader = req.headers.authorization || req.headers.dtoken;

        if (!authHeader) {
            return res.status(401).json({ success: false, message: 'Authorization token missing' });
        }

        // Extract token from 'Bearer <token>' format or use directly if passed via custom header
        const token = authHeader.startsWith('Bearer ')
            ? authHeader.split(' ')[1]
            : authHeader;

        // Verify token and attach user info to req
        const decoded = jwt.verify(token, env.JWT_SECRET);
        req.user = { id: decoded.id };
        next();
    } catch (error: any) {
        console.error('Auth Error:', error.message);
        res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};

export default authDoctor;