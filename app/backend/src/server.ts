import express from 'express'
import cors from 'cors'
import { env } from '@/src/env'
import errorHandler from './middlewares/error-handler';

export const createServer = () => {
    const app = express();
    app
        .disable('x-powered-by')
        .use(express.json())
        .use(
            cors({
                origin: env.FRONTEND_URL || "http://localhost:5173",
                credentials: true,
            }),
        );

    app.use("/v1", v1);

    app.use(errorHandler);

    return app;
}   
