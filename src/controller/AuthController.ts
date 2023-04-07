import { Request, Response } from "express";
import jwt from "jsonwebtoken"
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";

import { sendData, sendError, sendOk } from "../helper/ApiResponse";
import * as AuthService from "../service/AuthService";
import { AdminTokenData, UserTokenData } from "../middleware/AuthMiddleware";
import env from "../config/LoadEnv";
import { CustomError } from "../helper/Error";
import db from "../config/Db";
// import { GenerateRandomToken } from "./../util/Util";

type RegisterBody = {
	name: string;
	email: string;
	password: string;
};

export const Register = async (
	req: Request<{}, {}, RegisterBody>,
	res: Response
) => {
	const data = req.body;

	if (!data.email || !data.name || !data.password) {
        sendError(res, new CustomError(StatusCodes.BAD_REQUEST,"Insufficient data to register user"))
		return;
	}

	var hashedPassword;

	try {
		hashedPassword = await bcrypt.hash(data.password, 12);
	} catch (error) {
        sendError(res, error, null)
		return;
	}

	try {
		await db.user.create({
			data: { ...req.body, password: hashedPassword, isVerified: false },
		});
	} catch (error) {
        sendError(res, error, null)
		return;
	}

	// const verifyToken = GenerateRandomToken();

	// TODO: send email

	sendOk(res, 201, "Successfully registered user");
};

type VerifyAccountParams = {
	verifyToken: string;
};

export const VerifyAccount = async (
	req: Request<VerifyAccountParams>,
	res: Response
) => {
	// const { verifyToken } = req.params;

	// await db.accountVerification.findUniqueOrThrow({ where: { } });

    // TODO: account verification

    // await db.user.update({data: {isVerified: true}, where: {}})

	sendOk(res, 200, "Successfully verified account");
};

export const refreshAdminToken = (req: Request, res: Response) => {
    const bearerHeader = req.headers.authorization
    if (!bearerHeader || !bearerHeader.startsWith("Bearer ")) {
        sendError(res, new CustomError(StatusCodes.UNAUTHORIZED, "Invalid token"))
        return 
    }

    const token = bearerHeader.split(" ")[1]

    jwt.verify(token, env.ADMIN_REFRESH_TOKEN_KEY, async (err, decoded) => {
        if (err || decoded === undefined) {    
            sendError(res, new CustomError(StatusCodes.UNAUTHORIZED, "Invalid token"))
            return 
        }

        try {
            const data  = await AuthService.refreshAdminToken(decoded as AdminTokenData)

            sendData(res, StatusCodes.OK, data)
        } catch(err) {
            sendError(res, err)
        }
    })
}

export const refreshUserToken = (req: Request, res: Response) => {
    const bearerHeader = req.headers.authorization
    if (!bearerHeader || !bearerHeader.startsWith("Bearer ")) {
        sendError(res, new CustomError(StatusCodes.UNAUTHORIZED, "Invalid token"))
        return 
    }

    const token = bearerHeader.split(" ")[1]

    jwt.verify(token, env.USER_REFRESH_TOKEN_KEY, async (err, decoded) => {
        if (err || decoded === undefined) {
            
            sendError(res, new CustomError(StatusCodes.UNAUTHORIZED, "Invalid token"))
            return 
        }

        try {
            const data  = await AuthService.refreshUserToken(decoded as UserTokenData)

            sendData(res, StatusCodes.OK, data)
        } catch(err) {
            sendError(res, err)
        }
    })
}
