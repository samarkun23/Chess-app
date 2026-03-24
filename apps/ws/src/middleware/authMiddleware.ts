
import type { NextFunction, Request } from 'express';
import jwt from 'jsonwebtoken'
import type { JwtPayload } from 'jsonwebtoken';
import JWT_SECRET from '@repo/backend-common/jwt'
import { WebSocket } from 'ws'
import dotenv from 'dotenv'
import cookie from 'cookie'

dotenv.config();

export interface AuthWebSocket extends WebSocket {
    userId?: Number
}

export function authMiddleware(ws: AuthWebSocket, req: any): boolean {
    const cookies = req.headers.cookie;

    if (!cookies) {
        ws.close();
        return false;
    }

    //@ts-ignore
    const token = cookies.split(';').map(c => c.trim()).find(c => c.startsWith('token='))?.split('=')[1];

    //const parsedCookies = cookie.parse(cookies);
    //const token = parsedCookies.token;

    if (!token) {
        ws.close();
        return false;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET!) as JwtPayload;

        if (!decoded.userId) {
            ws.close(1008, "Invalid token");
            return false
        }

        ws.userId = Number(decoded.userId);
        return true;
    }

    catch (error) {
        ws.close(1008, "Unauthorized")
        return false;
    }
}
