
import type { NextFunction, Request } from 'express';
import jwt from 'jsonwebtoken'
import type { JwtPayload } from 'jsonwebtoken';
import JWT_SECRET from '@repo/backend-common/jwt'
import { WebSocket } from 'ws'
import dotenv from 'dotenv'

dotenv.config();

export interface AuthWebSocket extends WebSocket{
    userId? : String
}

export function authMiddleware(ws: AuthWebSocket, req: any): boolean{
    console.log("THIS IS SECRET : ", JWT_SECRET)
    console.log("req receive", req.url);
    const url = req.url;

    console.log(url)

    if(!url){
        ws.close(1008, "No url found")
        return false;
    }

    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get("token")

    console.log(token)
    if(!token){
        ws.close(1008, "Token not found")
        return false;
    }

    
    try {
        console.log("token")
        const decoded = jwt.verify(token, JWT_SECRET!);
        console.log(decoded);

        if (typeof decoded === 'string' || !decoded || !('userId' in decoded)) {
            ws.close(1008, "Invalid token");
            return false
        }

        console.log("BRO VERIFY ??")

        //@ts-ignore
        ws.userId = (decoded as JwtPayload).userId
        return true;
    } catch (error) {
        ws.close(1008, "Unauthorized")    
        return false;
    }
}
