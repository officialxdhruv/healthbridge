import { env } from '@/src/env'
import jwt from 'jsonwebtoken'
import express from 'express'

// user authentication middleware
async function authUser(req: express.Request, res: express.Response, next: express.NextFunction) {
    const { token } = req.headers
    if (!token) {
        return res.json({ success: false, message: 'Not Authorized Login Again' })
    }
    try {
        const token_decode = jwt.verify(token, env.JWT_SECRET)

        // ✅ Fix: Ensure req.body is defined before assigning to it
        if (!req.body) req.body = {}

        req.body.userId = token_decode.id
        next()
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export default authUser