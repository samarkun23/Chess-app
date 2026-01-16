import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

export function authMiddleware(req: Request,res:Response,next: NextFunction){
    const token = req.headers.authorization as unknown as string;

    try {
        const payload = jwt.verify(token,JWT_SECRET || "jwt-secret");
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
