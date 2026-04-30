import express from 'express'
import cors from 'cors'

import errorHandler from '@/middlewares/error-handler';
import v1 from '@/routes/v1';
import { env } from '@/env';
import EntityNotFoundError from './errors/EntityNotFoundError';

export const createServer = () => {
    const app = express();

    app
        .disable('x-powered-by')
        .use(express.json())
        .use(express.urlencoded({ extended: true }))
        .use(
            cors({
                origin: env.FRONTEND_URL,  // handle fallback in env validation
                credentials: true,
            }),
        );

    app.use("/api/v1", v1); // consistent versioning from the start

    app.get('/health', (_req, res) => {
        res.status(200).json({ ok: true, environment: env.NODE_ENV });
    });

    app.use('/testing', (req, res) => {
        throw new EntityNotFoundError("Testing error");
        res.status(200).json({ message: 'API is working' });
    });

    // 404 handler
    app.use((_req, res) => {
        res.status(404).json({ success: false, message: "Route not found" });
    });

    // Error handler
    app.use(errorHandler);

    return app;
}