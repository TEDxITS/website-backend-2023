import { Request, Response } from "express";
import jwt from "jsonwebtoken"
import { StatusCodes } from "http-status-codes";

import { sendData, sendError } from "../helper/ApiResponse";
import * as AuthService from "../service/AuthService";
import { AdminTokenData, UserTokenData } from "../middleware/AuthMiddleware";
import env from "../config/LoadEnv";

export const refreshAdminToken = (req: Request, res: Response) => {
    const bearerHeader = req.headers.authorization
    if (!bearerHeader || !bearerHeader.startsWith("Bearer ")) {
        sendError(res, StatusCodes.UNAUTHORIZED, null, "Invalid token")
        return 
    }

    const token = bearerHeader.split(" ")[1]

    jwt.verify(token, env.ADMIN_REFRESH_TOKEN_KEY, async (err, decoded) => {
        if (err || decoded === undefined) {    
            sendError(res, StatusCodes.UNAUTHORIZED, null, "Invalid token")
            return 
        }

        try {
            const data  = await AuthService.refreshAdminToken(decoded as AdminTokenData)

            sendData(res, StatusCodes.OK, data)
        } catch(err) {
            sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, null, (err as Error).message ?? "Internal Server Error")
        }
    })
}

export const refreshUserToken = (req: Request, res: Response) => {
    const bearerHeader = req.headers.authorization
    if (!bearerHeader || !bearerHeader.startsWith("Bearer ")) {
        sendError(res, StatusCodes.UNAUTHORIZED, null, "Invalid token")
        return 
    }

    const token = bearerHeader.split(" ")[1]

    jwt.verify(token, env.USER_REFRESH_TOKEN_KEY, async (err, decoded) => {
        if (err || decoded === undefined) {
            
            sendError(res, StatusCodes.UNAUTHORIZED, null, "Invalid token")
            return 
        }

        try {
            const data  = await AuthService.refreshUserToken(decoded as UserTokenData)

            sendData(res, StatusCodes.OK, data)
        } catch(err) {
            sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, null, (err as Error).message ?? "Internal Server Error")
        }
    })
}