import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import JWT_SECRET from '@repo/backend-common/jwt'

export function authMiddleware(req: Request,res:Response,next: NextFunction){
    const token = req.headers.authorization as unknown as string;

    try {
        const payload = jwt.verify(token,JWT_SECRET);
        if (payload) {
            //@ts-ignore
            req.id = payload.id;
            next();
        }

    } catch (error) {
        return res.json(403).json({
            message: "Invalid credentials", error
        }) 
    }
}
