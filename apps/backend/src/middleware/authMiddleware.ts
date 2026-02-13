import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import JWT_SECRET from '@repo/backend-common/jwt'

export function authMiddleware(req: Request,res:Response,next: NextFunction){
    const token = req.cookies.token as unknown as string;

    if(!token){
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    try {
        const payload = jwt.verify(token,JWT_SECRET);
        if (payload) {
            //@ts-ignore
            req.userId = payload.userId;
            return next();
        }

    } catch (error) {
        return res.json(403).json({
            message: "Invalid credentials", error
        }) 
    }
}
