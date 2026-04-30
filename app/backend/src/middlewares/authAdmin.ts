import jwt from "jsonwebtoken"
import express from "express"
import { env } from "@/env"

// admin authentication middleware
async function authAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        const { atoken } = req.headers
        if (!atoken) {
            return res.json({ success: false, message: 'Not Authorized Login Again' })
        }
        const token_decode = jwt.verify(atoken, env.JWT_SECRET)
        if (token_decode !== env.ADMIN_EMAIL + env.ADMIN_PASSWORD) {
            return res.json({ success: false, message: 'Not Authorized Login Again' })
        }
        next()
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export default authAdmin;