import { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import jwt from "jsonwebtoken"

import env from "../config/LoadEnv"
import { sendError } from "../helper/ApiResponse"

export interface UserTokenData extends jwt.JwtPayload {
    sub: string;
    email: string;
    name: string;
}

export interface UserToken extends Request {
    user: UserTokenData;
}

export interface AdminTokenData extends jwt.JwtPayload {
    sub: string;
    email: string;
}

export interface AdminToken extends Request {
    user: AdminTokenData;
}

export const UserAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const bearerHeader = req.headers.authorization
    if (!bearerHeader || !bearerHeader.startsWith("Bearer ")) {
        sendError(res, StatusCodes.UNAUTHORIZED, null, "Invalid token")
        return 
    }

    const token = bearerHeader.split(" ")[1]

    jwt.verify(token, env.USER_ACCESS_TOKEN_KEY, (err, decoded) => {
        if (err || decoded === undefined) {
            sendError(res, StatusCodes.UNAUTHORIZED, null, "Invalid token")
            return 
        }

        
        (req as UserToken).user = decoded as UserTokenData
        console.log((req as UserToken).user);
        
        next()
    })
}

export const AdminAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const bearerHeader = req.headers.authorization
    if (!bearerHeader || !bearerHeader.startsWith("Bearer ")) {
        sendError(res, StatusCodes.UNAUTHORIZED, null, "Invalid token")
        return 
    }

    const token = bearerHeader.split(" ")[1]

    jwt.verify(token, env.ADMIN_ACCESS_TOKEN_KEY, (err, decoded) => {
        if (err || decoded === undefined) {
            sendError(res, StatusCodes.UNAUTHORIZED, null, "Invalid token")
            return 
        }

        
        (req as AdminToken).user = decoded as AdminTokenData
        console.log((req as AdminToken).user);
        
        next()
    })
}